export default function TodoList({ todos, fieldOrder }) {
  const formatValue = (type, value) => {
    if (type === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    return String(value);
  };

  const renderField = (todo, field) => {
    switch (field) {
      case 'title':
        return (
          <div key={field} className="todo-title">{todo.title}</div>
        );
      case 'custom_field_type':
        return null; // Type is shown alongside value
      case 'custom_field_value':
        return (
          <div key={field} className="todo-custom-field">
            <span className="field-type">{todo.custom_field_type}:</span>
            <span className="field-value">
              {formatValue(todo.custom_field_type, todo.custom_field_value)}
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  if (todos.length === 0) {
    return <p className="empty-message">No todos yet. Create one above!</p>;
  }

  return (
    <div className="todo-list">
      <h2>Your Todos</h2>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className="todo-item">
            {fieldOrder.map((field) => renderField(todo, field))}
          </li>
        ))}
      </ul>
    </div>
  );
}
