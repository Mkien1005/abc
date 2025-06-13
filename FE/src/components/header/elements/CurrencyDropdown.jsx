const CuurencyDropdown = () => {
  return (
    <div className="dropdown">
      <button
        className="dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        VND
      </button>
      <ul className="dropdown-menu">
        <li>
          <a className="dropdown-item" href="#">
            VND - Việt Nam Đồng
          </a>
        </li>
        <li>
          <a className="dropdown-item" href="#">
            USD - Đô la Mỹ
          </a>
        </li>
        <li>
          <a className="dropdown-item" href="#">
            EUR - Euro
          </a>
        </li>
      </ul>
    </div>
  );
};

export default CuurencyDropdown;
