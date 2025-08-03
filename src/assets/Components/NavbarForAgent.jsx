import { Link, NavLink} from "react-router-dom";
import "./NavbarForAdmin.css"

const NavbarForAgent = () => {
  return (
    <nav>
      <Link to="/home" className="logo">REAMP</Link>
      <ul>
        <li>
          <NavLink to="/home/assignedcases">Assigned Cases</NavLink>
        </li>
        <li>
          <NavLink to="/home/agent">Agent</NavLink>
        </li>
      </ul>
    </nav>
  )
}

export default NavbarForAgent