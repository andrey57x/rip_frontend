import React, { useEffect, useState } from "react";
import { Form, InputGroup, Button } from "react-bootstrap";
import "./FiltersPanel.css";
type Props = {
  value?: string;
  onChange?: (newValue: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
};

const FiltersPanel: React.FC<Props> = ({
  value,
  onChange,
  onSearch,
  placeholder = "Поиск по названию реакции...",
}) => {
  const [internal, setInternal] = useState<string>(value ?? "");

  useEffect(() => {
    if (typeof value !== "undefined" && value !== internal) {
      setInternal(value);
    }
  }, [value]);


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
