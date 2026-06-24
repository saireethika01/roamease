import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import PackageCard from "../components/PackageCard";
import Pagination from "../components/Pagination";
import { useCurrencyRates } from "../hooks/useCurrency";
import destinations from "../data/destinations";
import "./TripPackages.css";

const PAGE_SIZE = 6;

export default function TripPackages() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const { rates } = useCurrencyRates();
  const [urlParams] = useSearchParams();
  const placeFilter = urlParams.get("place");

  const filtered = placeFilter
    ? destinations.filter((d) => d.id === placeFilter)
    : destinations.filter((d) =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.title.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);

  const paginated = placeFilter
    ? filtered
    : filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function handlePageChange(page) {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <div>
      <Navbar />
      <div className="trip-page">
      <h1 className="trip-heading">Trip Packages</h1>

      {!placeFilter && (
        <div className="trip-search-wrap">
          <input
            type="text"
            className="trip-search"
            placeholder="Search destinations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      {filtered.length === 0 && (
        <p className="trip-empty">No destinations found for "{searchQuery}".</p>
      )}

      <div className="trip-grid">
        {paginated.map((dest) => (
          <PackageCard key={dest.id} destination={dest} rates={rates} />
        ))}
      </div>

      {!placeFilter && filtered.length > PAGE_SIZE && (
        <Pagination
          currentPage={safePage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
      </div>
    </div>
  );
}
