import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import CalibrationTable from "../components/Calibration";
import axios from "axios";
import { BACKEND_ENDPOINT } from "../api/api";

// Data for instrument types, products, and companies
const dataProducts = {
  Pressure: [
    "Process Controller",
    "Diff. Pr. Transmitter",
    "Digital Pressure Gauge",
    "Pressure Gauge",
    "Pressure Transmitter",
    "Pressure Sensor",
    "Pressure Switch",
    "Pressure Safety Valve",
  ],
  Temperature: [
    "Process Controller",
    "Temperature Gauge",
    "Digital Temperature Gauge",
    "Head mounted Temp. Transmitter",
    "Digital Temperature Transmitter",
    "Temperature Indicator",
    "Temperature controller",
  ],
  Humidity: ["Process Controller", "Humidity-Temperature Transmitter"],
  Flow: [
    "Process Controller",
    "Electromagnetic Flow meter",
    "Vortex Flow meter",
    "Mass Flow meter",
    "Thermal Mass Flow meter",
    "DP-Orifice Flow meter",
  ],
  Level: [
    "Process Controller",
    "Single Diaphragm Level Tx.",
    "Double Diaphragm Level Tx.",
    "Ultrasonic level sensor",
    "Ultrasonic level transmitter",
    "Radar level transmitter",
    "Capacitance level transmitter",
    "Magnetic float level transmitter",
    "DP Level transmitter",
    "Hydrostatic level transmitter",
  ],
};

const dataCompany = {
  companyName: {
    Alchem: "Bharuch",
    Gulbrandson: "Bharuch",
    GNFC: "Dahej",
    Sriram: "Jaghadia",
    OPAL: "Dahej",
  },
  make: ["Siemens", "Elecon", "Automac"],
};

const dataUnits = {
  pressure: ["mmwc", "mmhg", "kpa", "Kg/cm2", "Bar", "psi", "pa"],
  temperature: ["Degree C"],
  flow: ["m3/ min.", "m3/Hr", "LPM", "LPH", "Kg/Hr", "Nm3/Hr", "Ton/Hr"],
  level: ["mm", "cm", "m", "Kg", "Liter", "Ton"],
  humidity: ["Degree C", "RH%"],
};

const Certificate = () => {
  const [companyName, setCompanyName] = useState(
    Object.keys(dataCompany.companyName)
  );
  const [companyAddress, setCompanyAddress] = useState("");
  const [instrumentMake, setInstrumentMake] = useState(dataCompany.make);
  const [instruments, setInstruments] = useState([]);
  const [unit, setUnit] = useState([]);
  const [percentageValues, setPercentageValues] = useState({
    zero: 0,
    twentyFive: 0,
    fifty: 0,
    seventyFive: 0,
    hundred: 0,
  });
  const [calibrationData, setCalibrationData] = useState([
    {
      id: 1,
      reading: percentageValues.zero || "0", // Default to "0" if percentageValues.zero is not defined
      ideal: "0%",
      upReading: "",
      downReading: "",
      upDiff: "",
      downDiff: "",
      upAccuracy: "",
      downAccuracy: "",
      upOutput: "",
      downOutput: "",
      remark: "",
    },
    {
      id: 2,
      reading: percentageValues.twentyFive || "", // Pre-fill with 25% value
      ideal: "25%",
      upReading: "",
      downReading: "",
      upDiff: "",
      downDiff: "",
      upAccuracy: "",
      downAccuracy: "",
      upOutput: "",
      downOutput: "",
      remark: "",
    },
    {
      id: 3,
      reading: percentageValues.fifty || "", // Pre-fill with 50% value
      ideal: "50%",
      upReading: "",
      downReading: "",
      upDiff: "",
      downDiff: "",
      upAccuracy: "",
      downAccuracy: "",
      upOutput: "",
      downOutput: "",
      remark: "",
    },
    {
      id: 4,
      reading: percentageValues.seventyFive || "", // Pre-fill with 75% value
      ideal: "75%",
      upReading: "",
      downReading: "",
      upDiff: "",
      downDiff: "",
      upAccuracy: "",
      downAccuracy: "",
      upOutput: "",
      downOutput: "",
      remark: "",
    },
    {
      id: 5,
      reading: percentageValues.hundred || "", // Pre-fill with 100% value
      ideal: "100%",
      upReading: "",
      downReading: "",
      upDiff: "",
      downDiff: "",
      upAccuracy: "",
      downAccuracy: "",
      upOutput: "",
      downOutput: "",
      remark: "",
    },
  ]);

  const [formData, setFormData] = useState({
    companyName: "",
    companyAddress: "",
    // certificateNo: "",
    instrumentSerial: "",
    instrumentType: "",
    instrumentDetails: "",
    instrumentMake: "",
    instrumentModel: "",
    instrumentRangeLow: "",
    instrumentRangeHigh: "",
    instrumentDate: "",
    masterModel: "",
    masterCalDate: "",
    masterMake: "",
    masterRange: "",
  });
  const [selectedType, setSelectedType] = useState("");

  const fetchProductsDataFromServer = async () => {
    const res = await axios.get(`${BACKEND_ENDPOINT}/products`);
    console.log(res.data);
    setCompanyName(Object.keys(dataCompany.companyName));
  };

  const fetchCompanyDataFromServer = async () => {
    const res = await axios.get(`${BACKEND_ENDPOINT}/company`);
  };

  useEffect(() => {
    fetchProductsDataFromServer();
    fetchCompanyDataFromServer();
  }, []);

  // Function to calculate percentage values based on range
  const calculatePercentageValues = (low, high) => {
    if (!low || !high || isNaN(low) || isNaN(high)) return;
    const parsedLow = parseFloat(low);
    const parsedHigh = parseFloat(high);
    setPercentageValues({
      zero: parsedLow,
      twentyFive: parsedLow + (parsedHigh - parsedLow) * 0.25,
      fifty: parsedLow + (parsedHigh - parsedLow) * 0.5,
      seventyFive: parsedLow + (parsedHigh - parsedLow) * 0.75,
      hundred: parsedHigh,
    });
  };

  // Recalculate percentage when rangeLow or rangeHigh changes
  useEffect(() => {
    const { instrumentRangeLow, instrumentRangeHigh } = formData;
    calculatePercentageValues(instrumentRangeLow, instrumentRangeHigh);
  }, [formData.instrumentRangeLow, formData.instrumentRangeHigh]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Update address when company name changes
    if (name === "companyName") {
      const address = dataCompany.companyName[value] || "";
      setCompanyAddress(address);
      setFormData((prev) => ({
        ...prev,
        companyAddress: address,
      }));
    }

    // Update instrument details and units when instrument type changes
    if (name === "instrumentType") {
      setSelectedType(value);
      setInstruments(dataProducts[value] || []);
      setUnit(dataUnits[value.toLowerCase()] || []); // Update unit based on selected instrument type
      setFormData((prev) => ({
        ...prev,
        instrumentDetails: "",
        instrumentMake: "",
        selectedUnit: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      ...formData,
      ...calibrationData,
    };

    console.log(data);

    const res = await axios.post(`${BACKEND_ENDPOINT}/certificates/`, data);
  };

  return (
    <div>
      <Header />
      <div className="p-2 mt-5">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col">
            {/* Company Information Section */}
            <div className="border p-4">
              <h1 className="font-bold text-xl mb-2">Company Details</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                <div className="flex flex-col">
                  <label htmlFor="company">Company Name:</label>
                  <select
                    id="company"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="border w-full"
                    required
                  >
                    <option value="" disabled>
                      Select company name
                    </option>
                    {companyName.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col">
                  <label>Company Address:</label>
                  <input
                    type="text"
                    name="companyAddress"
                    value={companyAddress}
                    className="border w-full"
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Instrument Details Section */}
            <div className="border p-4 mt-4">
              <h1 className="font-bold text-xl mb-2">Instrument Details</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                {/* <div className="flex flex-col">
                  <label>Certificate No.:</label>
                  <input
                    type="text"
                    name="certificateNo"
                    value={formData.certificateNo}
                    onChange={handleChange}
                    className="border w-full"
                  />
                </div> */}

                <div className="flex flex-col">
                  <label>Instrument Sr. No.:</label>
                  <input
                    type="text"
                    name="instrumentSerial"
                    value={formData.instrumentSerial}
                    onChange={handleChange}
                    className="border w-full"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label>Instrument Type:</label>
                  <select
                    name="instrumentType"
                    value={formData.instrumentType}
                    onChange={handleChange}
                    className="border w-full"
                    required
                  >
                    <option value="" disabled>
                      Select instrument type
                    </option>
                    {Object.keys(dataProducts).map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col">
                  <label>Instrument Details:</label>
                  <select
                    name="instrumentDetails"
                    value={formData.instrumentDetails}
                    onChange={handleChange}
                    className="border w-full"
                    disabled={!selectedType}
                    required
                  >
                    <option value="" disabled>
                      Select instrument
                    </option>
                    {instruments.map((detail) => (
                      <option key={detail} value={detail}>
                        {detail}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col">
                  <label>Model:</label>
                  <input
                    type="text"
                    name="instrumentModel"
                    value={formData.instrumentModel}
                    onChange={handleChange}
                    className="border w-full"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label>Make:</label>
                  <select
                    name="instrumentMake"
                    value={formData.instrumentMake}
                    onChange={handleChange}
                    className="border w-full"
                    required
                  >
                    <option value="" disabled>
                      Select make
                    </option>
                    {instrumentMake.map((make) => (
                      <option key={make} value={make}>
                        {make}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Unit Dropdown */}
                <div className="flex flex-col">
                  <label>Unit:</label>
                  <select
                    name="selectedUnit"
                    value={formData.selectedUnit}
                    onChange={handleChange}
                    className="border w-full"
                    required
                  >
                    <option value="" disabled>
                      Select unit
                    </option>
                    {unit.map((unitOption) => (
                      <option key={unitOption} value={unitOption}>
                        {unitOption}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Range Low with Unit beside Label and inside as Placeholder */}
                <div className="flex flex-col">
                  <label>
                    Range Low{" "}
                    {formData.selectedUnit && `(${formData.selectedUnit})`}:
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      name="instrumentRangeLow"
                      value={formData.instrumentRangeLow}
                      onChange={handleChange}
                      placeholder={
                        formData.selectedUnit
                          ? `Enter value (${formData.selectedUnit})`
                          : "Enter value"
                      }
                      className="border w-full"
                      required
                    />
                  </div>
                </div>

                {/* Range High with Unit beside Label and inside as Placeholder */}
                <div className="flex flex-col">
                  <label>
                    Range High{" "}
                    {formData.selectedUnit && `(${formData.selectedUnit})`}:
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      name="instrumentRangeHigh"
                      value={formData.instrumentRangeHigh}
                      onChange={handleChange}
                      placeholder={
                        formData.selectedUnit
                          ? `Enter value (${formData.selectedUnit})`
                          : "Enter value"
                      }
                      className="border w-full"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label>Date:</label>
                  <input
                    type="date"
                    name="instrumentDate"
                    value={formData.instrumentDate}
                    onChange={handleChange}
                    className="border w-full"
                    required
                  />
                </div>
              </div>
            </div>
            {/* Master Instrument Details */}
            <div className="border p-4 mt-4">
              <h1 className="font-bold text-xl mb-2">Master Inst. Details</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                <div className="flex flex-col">
                  <label>Model:</label>
                  <input
                    type="text"
                    name="masterModel"
                    value={formData.masterModel}
                    onChange={handleChange}
                    className="border w-full"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label>Last Cal. Date:</label>
                  <input
                    type="date"
                    name="masterCalDate"
                    value={formData.masterCalDate}
                    onChange={handleChange}
                    className="border w-full"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label>Make:</label>
                  <input
                    type="text"
                    name="masterMake"
                    value={formData.masterMake}
                    onChange={handleChange}
                    className="border w-full"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label>Range:</label>
                  <input
                    type="text"
                    name="masterRange"
                    value={formData.masterRange}
                    onChange={handleChange}
                    className="border w-full"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Calibration Certificate Table */}
            <CalibrationTable
              percentageValues={percentageValues}
              calibrationData={calibrationData}
              setCalibrationData={setCalibrationData}
            />
          </div>
          <button
            type="submit"
            className="border rounded-lg text-black bg-orange-500 p-4 text-2xl"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Certificate;
