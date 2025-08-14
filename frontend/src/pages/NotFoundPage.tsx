import { Link } from "react-router-dom"

export default function NotFoundPage() {
  return (
    <>
      <div className="NotFound">
        404 Page Not Found

        <Link to="/"> Home from Link </Link> 
        <a href="/"> Home from A </a>

      </div>
    </>
  );

  //dIFFERENCE BETWEEN Link and A is that Link doesnt need to do full page reload
}