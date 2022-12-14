import { useEffect, useState } from "react";
import Input from "./../components/Input";
import SearchableSelect from "./../components/SearchableSelect";
import axios from "axios";
import Postmonger from "postmonger";
import setupTestMock from "./../test/testMock";
import {
  DatabaseDropdownIndicator,
  DatePickerIcon,
  getEventSchemaFields,
} from "../utils";
import DatePicker, { registerLocale } from "react-datepicker";
import fr from "date-fns/locale/fr";
registerLocale("fr", fr);

import "react-datepicker/dist/react-datepicker.css";

/**
 *
 */
const connection = new Postmonger.Session();

/**
 *
 */
export { connection };

/**
 *
 */
setupTestMock(connection);

/**
 *
 */
export default function Home() {
  const [activityName, setActivityName] = useState(null);
  const [activityDescription, setActivityDescription] = useState(null);
  const [eventList, setEventList] = useState([]);
  const [entryDEFields, setEntryDEFields] = useState([]);
  const [datePickerIsOpen, setDatePickerIsOpen] = useState(false);

  const [startDate, setStartDate] = useState(new Date());
  const toggleDatePickerIsOpen = () => setDatePickerIsOpen(!datePickerIsOpen);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDynamicEvent, setIsDynamicEvent] = useState(false);
  const [selectedLoyaltyAccount, setSelectedLoyaltyAccount] = useState(null);
  const [selectedLoyaltyStore, setSelectedLoyaltyStore] = useState(null);
  const [selectedLoyaltyEventDateSelect, setSelectedLoyaltyEventDateSelect] =
    useState(null);
  const [selectedLoyaltyPoints, setSelectedLoyaltyPoints] = useState(null);

  useEffect(() => {
    const event = eventList.find((e) => e.id === selectedEvent.value);

    setIsDynamicEvent(event?.is_dynamic);
  }, [selectedEvent]);

  useEffect(() => {
    (async () => {
      try {
        const req = await axios.get("http://localhost:3000/event-list");

        setEventList(req.data);
      } catch (e) {
        console.log(e);
      }
    })();

    connection.on("initActivity", (payload) => {
      console.log("initActivity", payload);

      setActivityName(payload.name);

      if (payload.description) {
        setActivityDescription(payload.description);
      }
    });

    connection.on("requestedSchema", (payload) => {
      setEntryDEFields(getEventSchemaFields(payload));
    });

    connection.trigger("ready");
    connection.trigger("requestSchema");
  }, []);

  return (
    <>
      <div className="activity-detail slds-grid slds-m-bottom_medium">
        <div className="slds-col slds-size_1-of-2 slds-p-right_small activity-name-container">
          <Input
            id={"activityName"}
            label="Nom de l'activité"
            defaultValue={activityName}
            onChange={(e) => setActivityName(e.target.value)}
            required={true}
          />
        </div>

        <div className="slds-col slds-size_1-of-2 slds-p-right_small activity-name-container">
          <Input
            id={"activityDescription"}
            label="Description"
            defaultValue={activityDescription}
            onChange={(e) => setActivityDescription(e.target.value)}
          />
        </div>
      </div>

      <div
        className="slds-grid slds-grid_vertical"
        style={{ rowGap: "20px", marginTop: "40px" }}
      >
        <div className="slds-col">
          <SearchableSelect
            id="eventSelect"
            options={eventList.map((event) => ({
              value: event.id,
              label: event.title,
            }))}
            label="Évènement"
            required={true}
            onChange={(e) => setSelectedEvent(e)}
          />
        </div>

        <div className="slds-col">
          <SearchableSelect
            components={{ DropdownIndicator: DatabaseDropdownIndicator }}
            id="loyaltyAccountSelect"
            options={entryDEFields}
            label="Identifiant compte fidélité"
            required={true}
            isCreatable={true}
            onChange={(e) => setSelectedLoyaltyAccount(e)}
          />
        </div>

        <div className="slds-col">
          <SearchableSelect
            components={{ DropdownIndicator: DatabaseDropdownIndicator }}
            id="loyaltyStoreSelect"
            options={entryDEFields}
            label="Identifiant magasin"
            required={true}
            isCreatable={true}
            onCahnge={(e) => setSelectedLoyaltyStore(e)}
          />
        </div>

        <div
          className="slds-col"
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "20px",
          }}
        >
          <div style={{ flex: 1 }}>
            <SearchableSelect
              components={{ DropdownIndicator: DatabaseDropdownIndicator }}
              id="loyaltyEventDateSelect"
              options={entryDEFields}
              label="Date de l'événements"
              required={true}
              isCreatable={true}
              onChange={(e) => setSelectedLoyaltyEventDateSelect(e)}
              value={selectedLoyaltyEventDateSelect}
            />
          </div>
          <div
            className=""
            style={{
              display: "flex",
              alignItems: "end",
              justifyContent: "center",
              marginBottom: "7px",
              marginRight: "10px",
              position: "relative",
            }}
          >
            <button className="slds-button" onClick={toggleDatePickerIsOpen}>
              <DatePickerIcon />
            </button>
            <div
              style={{
                position: "absolute",
                top: 70,
                left: -215,
                zIndex: 9999,
              }}
            >
              {datePickerIsOpen && (
                <DatePicker
                  startDate={startDate}
                  onChange={(date) => {
                    const formattedDate = date.toLocaleDateString("fr");
                    setSelectedLoyaltyEventDateSelect({
                      value: formattedDate,
                      label: formattedDate,
                    });
                  }}
                  locale="fr"
                  showYearDropdown
                  dropdownMode="select"
                  inline
                />
              )}
            </div>
          </div>
        </div>

        {isDynamicEvent && (
          <div className="slds-col">
            <SearchableSelect
              components={{ DropdownIndicator: DatabaseDropdownIndicator }}
              id="loyaltyPointsSelect"
              options={entryDEFields}
              label="Valeur points"
              required={true}
              isCreatable={true}
              onCahnge={(e) => setSelectedLoyaltyPoints(e)}
            />
          </div>
        )}
      </div>
    </>
  );
}
