const BudgetForm = ({ isEdit = false, data = {}, onSubmit }) => {
    const [formData, setFormData] = useState({
      category: '',
      limit: '',
      ...data,
    });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <label>
          Category:
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Limit:
          <input
            type="number"
            name="limit"
            value={formData.limit}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">{isEdit ? 'Update Budget' : 'Add Budget'}</button>
      </form>
    );
  };