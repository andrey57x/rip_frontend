import React, { useEffect, useState } from "react";
import { Form, InputGroup, Button } from "react-bootstrap";
import "./FiltersPanel.css";

type Props = {
  /** Текущее значение (контролируемый компонент) — опционально */
  value?: string;
  /** Колбэк при изменении (возвращает новое значение строки поиска) */
  onChange?: (newValue: string) => void;
  /** Колбэк, вызываемый когда пользователь «подтвердил» поиск (нажатие Enter/кнопки) */
  onSearch?: (value: string) => void;
  placeholder?: string;
  /** задержка дебаунса в миллисекундах (по умолчанию 300) */
  debounceMs?: number;
};

/**
 * FiltersPanel — простая и красивая строка поиска по названию реакции.
 * Поведение:
 *  - если передано value/onChange — работает как контролируемый компонент
 *  - если не передано — держит внутренний state
 *  - вызывает onSearch с дебаунсом при вводе (если он передан)
 *  - на Enter или нажатие кнопки вызывает onSearch сразу
 */
const FiltersPanel: React.FC<Props> = ({
  value,
  onChange,
  onSearch,
  placeholder = "Поиск по названию реакции...",
  debounceMs = 300,
}) => {
  const [internal, setInternal] = useState<string>(value ?? "");

  // Синхронизируем внутреннее состояние, если компонент контролируется извне
  useEffect(() => {
    if (typeof value !== "undefined" && value !== internal) {
      setInternal(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Дебаунс вызова onSearch при вводе
  useEffect(() => {
    if (!onSearch) return;
    const t = setTimeout(() => {
      onSearch(internal);
    }, debounceMs);
    return () => clearTimeout(t);
  }, [internal, onSearch, debounceMs]);

  const handleInputChange = (v: string) => {
    if (onChange) {
      onChange(v);
    } else {
      setInternal(v);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (onSearch) onSearch(internal);
  };

  return (
    <form
      className="filters-panel"
      onSubmit={handleSubmit}
      role="search"
      aria-label="Поиск реакций"
    >
      <InputGroup className="search-input-group">
        <InputGroup.Text className="search-icon" aria-hidden>
          {/* Простая SVG-иконка лупы (встроенная, чтобы не требовать external icons) */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <path
              d="M21 21l-4.35-4.35"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              cx="11"
              cy="11"
              r="6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </InputGroup.Text>

        <Form.Control
          type="search"
          placeholder={placeholder}
          aria-label="Поиск по названию реакции"
          value={internal}
          onChange={(e) => handleInputChange(e.target.value)}
          className="search-input"
        />

        <Button
          variant="primary"
          type="submit"
          className="search-button"
          aria-label="Найти"
        >
          Поиск
        </Button>
      </InputGroup>
    </form>
  );
};

export default FiltersPanel;
