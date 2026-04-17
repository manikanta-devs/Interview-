import { Link } from 'react-router-dom';

function NavCard({ to, title, description }) {
  return (
    <Link className="nav-card" to={to}>
      <h3>{title}</h3>
      <p>{description}</p>
    </Link>
  );
}

export default NavCard;
