import { Link, NavLink} from "react-router-dom";
import "./NavbarForAdmin.css"

const NavbarForAdmin = () => {
  return (
    <nav>
      <Link to="/home" className="logo">REAMP</Link>
      <ul>
        <li>
          <NavLink to="/home/cases">Listing Cases</NavLink>
        </li>
        <li>
          <NavLink to="/home/agents">Agents</NavLink>
        </li>
      </ul>
    </nav>
  )
}

export default NavbarForAdmin