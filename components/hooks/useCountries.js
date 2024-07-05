import { useState, useEffect } from 'react';
import axios from 'axios';
import { countriesApi } from '../../utils/apiConfig';

const useCountries = () => {
  const [countryNameArr, setCountryNameArr] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get(countriesApi);
        const filteredData = data.filter(
          (country) => country.name.common !== 'Palestine'
        );
        const sortedData = filteredData.sort((a, b) =>
          a.name.common.localeCompare(b.name.common)
        );
      
        const countriesArr = sortedData.map((x) => x.name);
        const countryNameArr = countriesArr.map((x) => x.common);
        setCountryNameArr(countryNameArr);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    getData();
  }, []);

  return {countryNameArr};
};

export default useCountries;
