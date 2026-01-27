import { useState, useEffect } from 'react';

export default function TodoForm({ fieldOrder, onSubmit, onReorder }) {
  const [title, setTitle] = useState('');
  const [customFieldType, setCustomFieldType] = useState('string');
  const [customFieldValue, setCustomFieldValue] = useState('');
  const [errors, setErrors] = useState({});
  const [draggedField, setDraggedField] = useState(null);

  useEffect(() => {
    setCustomFieldValue(customFieldType === 'boolean' ? false : '');
    setErrors((prev) => ({ ...prev, custom_field_value: '' }));
  }, [customFieldType]);

  const validateField = (field, value) => {
    switch (field) {
      case 'title':
        return !value.trim() ? 'Title is required' : '';
      case 'custom_field_value':
        if (customFieldType === 'string') {
          return !String(value).trim() ? 'Value is required' : '';
        }
        if (customFieldType === 'number') {
          return value === '' || isNaN(Number(value)) ? 'Must be a valid number' : '';
        }
        return '';
      default:
        return '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {
      title: validateField('title', title),
      custom_field_value: validateField('custom_field_value', customFieldValue),
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((err) => err)) {
      return;
    }

    let finalValue = customFieldValue;
    if (customFieldType === 'number') {
      finalValue = Number(customFieldValue);
    }

    onSubmit({
      title: title.trim(),
      custom_field_type: customFieldType,
      custom_field_value: finalValue,
    });

    setTitle('');
    setCustomFieldType('string');
    setCustomFieldValue('');
    setErrors({});
  };

  const handleDragStart = (field) => {
    setDraggedField(field);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (targetField) => {
    if (!draggedField || draggedField === targetField) {
      setDraggedField(null);
      return;
    }

    const newOrder = [...fieldOrder];
    const draggedIndex = newOrder.indexOf(draggedField);
    const targetIndex = newOrder.indexOf(targetField);

    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedField);

    onReorder(newOrder);
    setDraggedField(null);
  };

  const renderField = (field) => {
    switch (field) {
      case 'title':
        return (
          <div key={field} className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErrors((prev) => ({ ...prev, title: '' }));
              }}
              onBlur={() => setErrors((prev) => ({ ...prev, title: validateField('title', title) }))}
            />
            {errors.title && <span className="field-error">{errors.title}</span>}
          </div>
        );

      case 'custom_field_type':
        return (
          <div key={field} className="form-group">
            <label htmlFor="custom_field_type">Custom Field Type</label>
            <select
              id="custom_field_type"
              value={customFieldType}
              onChange={(e) => setCustomFieldType(e.target.value)}
            >
              <option value="string">String</option>
              <option value="boolean">Boolean</option>
              <option value="number">Number</option>
            </select>
          </div>
        );

      case 'custom_field_value':
        return (
          <div key={field} className="form-group">
            <label htmlFor="custom_field_value">Custom Field Value</label>
            {customFieldType === 'boolean' ? (
              <select
                id="custom_field_value"
                value={customFieldValue.toString()}
                onChange={(e) => setCustomFieldValue(e.target.value === 'true')}
              >
                <option value="false">False</option>
                <option value="true">True</option>
              </select>
            ) : (
              <input
                id="custom_field_value"
                type={customFieldType === 'number' ? 'number' : 'text'}
                value={customFieldValue}
                onChange={(e) => {
                  setCustomFieldValue(e.target.value);
                  setErrors((prev) => ({ ...prev, custom_field_value: '' }));
                }}
                onBlur={() =>
                  setErrors((prev) => ({
                    ...prev,
                    custom_field_value: validateField('custom_field_value', customFieldValue),
                  }))
                }
              />
            )}
            {errors.custom_field_value && (
              <span className="field-error">{errors.custom_field_value}</span>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <h2>Create Todo</h2>
      <p className="reorder-hint">Drag fields to reorder</p>

      {fieldOrder.map((field) => (
        <div
          key={field}
          draggable
          onDragStart={() => handleDragStart(field)}
          onDragOver={handleDragOver}
          onDrop={() => handleDrop(field)}
          className={`draggable-field ${draggedField === field ? 'dragging' : ''}`}
        >
          <span className="drag-handle">&#8942;&#8942;</span>
          {renderField(field)}
        </div>
      ))}

      <button type="submit">Add Todo</button>
    </form>
  );
}
