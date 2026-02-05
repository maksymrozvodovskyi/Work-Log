import { useState } from "react";

export default function useSelectModal(initialSearchTerm = "") {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  return {
    searchTerm,
    setSearchTerm,
  };
}
