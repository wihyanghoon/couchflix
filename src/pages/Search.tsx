import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
const Search = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  useEffect(()=> {
    console.log(searchParams.get("keyword"))
  } , [searchParams])
  
  return (
    <div>Search</div>
  )
}


export default Search