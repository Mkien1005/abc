const LangDropdown = () => {
  return (
    <div className="dropdown">
      <button
        className="dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        Vi
      </button>
      <ul className="dropdown-menu">
        <li>
          <a className="dropdown-item" href="#">
            Tiếng Việt
          </a>
        </li>
        <li>
          <a className="dropdown-item" href="#">
            Tiếng Anh
          </a>
        </li>
        <li>
          <a className="dropdown-item" href="#">
            Tiếng Tây Ban Nha
          </a>
        </li>
      </ul>
    </div>
  );
};

export default LangDropdown;
