import { Link, NavLink} from "react-router-dom";
import { useState } from "react";
import "./NavbarForAdmin.css"

const NavBarForPhotographyCompany = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(prev => !prev);
  return (
    <nav>
      <Link to="/home" className="logo">REAMP</Link>
      <div className="menu-toggle" onClick={toggleMenu}>
        ☰
      </div>
      <ul className={isOpen ? "show" : ""}>
        <li>
          <NavLink to="/home/cases">Listing Cases</NavLink>
        </li>
        <li>
          <NavLink to="/home/agents">Agents</NavLink>
        </li>
        <li>
          <NavLink to="/home/companies">Photography Companies</NavLink>
        </li>
      </ul>
    </nav>
  )
}

export default NavBarForPhotographyCompany