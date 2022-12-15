import { useCallback, useEffect, useState } from "react";
import Input from "./../components/Input";
import SearchableSelect from "./../components/SearchableSelect";
import axios from "axios";
import Postmonger from "postmonger";
import setupTestMock from "./../test/testMock";
import {
  DatabaseDropdownIndicator,
  DatePickerIcon,
  getEventSchemaFields,
  isNull,
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

connection.on("clickedNext", () => {
  window.save();
});

/**
 * TODO :
 * - Rajouter et peaufiner le controle (integer et date)
 * - Préparer speech et ce qui reste a faire
 */
export default function Home() {
  const [activityState, setActivityState] = useState(null);
  const [editable, setEditable] = useState(true);
  const [activityName, setActivityName] = useState(null);
  const [activityDescription, setActivityDescription] = useState(null);
  const [eventList, setEventList] = useState([]);
  const [entryDEFields, setEntryDEFields] = useState([]);
  const [datePickerIsOpen, setDatePickerIsOpen] = useState(false);

  const [startDate, setStartDate] = useState(new Date());
  const toggleDatePickerIsOpen = () =>
    setDatePickerIsOpen(!datePickerIsOpen && editable);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDynamicEvent, setIsDynamicEvent] = useState(false);
  const [selectedLoyaltyAccount, setSelectedLoyaltyAccount] = useState(null);
  const [selectedLoyaltyStore, setSelectedLoyaltyStore] = useState(null);
  const [selectedLoyaltyEventDateSelect, setSelectedLoyaltyEventDateSelect] =
    useState(null);
  const [selectedLoyaltyPoints, setSelectedLoyaltyPoints] = useState(null);

  useEffect(() => {
    const event = eventList.find((e) => e.id === selectedEvent?.value);

    setIsDynamicEvent(event?.is_dynamic);
  }, [selectedEvent]);

  useEffect(() => {
    (async () => {
      try {
        const url = import.meta.env.DEV
          ? "http://localhost:3000/event-list/"
          : "/event-list/";

        const req = await axios.get(url);

        setEventList(req.data);
      } catch (e) {
        console.log(e);
      }
    })();

    connection.on("initActivity", (payload) => {
      console.log("initActivity", payload);

      setActivityState({ ...payload });

      setActivityName(payload.name || "Lineup7 Boxfid");

      setEditable(payload.editable);

      if (payload.metaData?.description != undefined) {
        setActivityDescription(payload.metaData?.description);
      }

      if (payload.arguments?.execute?.inArguments?.length > 0) {
        const inArguments = payload.arguments.execute.inArguments[0];

        setSelectedEvent(inArguments.eventList);
        setSelectedLoyaltyAccount(inArguments.loyaltyAccount);
        setSelectedLoyaltyStore(inArguments.loyaltyStore);
        setSelectedLoyaltyEventDateSelect(inArguments.loyaltyEventDateSelect);
        setSelectedLoyaltyPoints(inArguments.loyaltyPoints);
      }
    });

    connection.on("requestedSchema", (payload) => {
      setEntryDEFields(getEventSchemaFields(payload));
    });

    connection.trigger("ready");
    connection.trigger("requestSchema");
  }, []);

  useEffect(() => {
    if (
      selectedEvent == null ||
      selectedLoyaltyAccount == null ||
      selectedLoyaltyStore == null ||
      selectedLoyaltyEventDateSelect == null
    ) {
      console.log(
        selectedEvent,
        selectedLoyaltyAccount,
        selectedLoyaltyStore,
        selectedLoyaltyEventDateSelect
      );
      console.log("disable next button (1)");
      connection.trigger("updateButton", { button: "next", enabled: false });
    } else {
      console.log("enable next button (3)");

      if (isDynamicEvent && selectedLoyaltyPoints == null) {
        console.log("disable next button (2)");
        connection.trigger("updateButton", { button: "next", enabled: false });
      } else {
        connection.trigger("updateButton", { button: "next", enabled: true });
      }
    }
  }, [
    activityState,
    activityName,
    selectedEvent,
    selectedLoyaltyAccount,
    selectedLoyaltyStore,
    selectedLoyaltyEventDateSelect,
    selectedLoyaltyPoints,
    isDynamicEvent,
  ]);

  window.save = useCallback(() => {
    const payload = { ...activityState };

    payload.name = activityName;
    payload.metaData.description = activityDescription;

    const newInArguments = {
      eventList: selectedEvent,
      loyaltyAccount: selectedLoyaltyAccount,
      loyaltyStore: selectedLoyaltyStore,
      loyaltyEventDateSelect: selectedLoyaltyEventDateSelect,
      loyaltyPoints: selectedLoyaltyPoints,
    };

    payload.arguments.execute.inArguments = [newInArguments];

    payload.metaData.isConfigured = true;

    console.log("updated activity", JSON.stringify(payload));

    connection.trigger("updateActivity", payload);
  }, [
    activityState,
    activityName,
    activityDescription,
    selectedEvent,
    selectedLoyaltyAccount,
    selectedLoyaltyStore,
    selectedLoyaltyEventDateSelect,
    selectedLoyaltyPoints,
  ]);

  if (activityState === null) {
    return (
      <div className="demo-only">
        <div className="slds-spinner_container">
          <div
            role="status"
            className="slds-spinner slds-spinner_medium slds-spinner_brand"
          >
            <span className="slds-assistive-text">Loading</span>
            <div className="slds-spinner__dot-a"></div>
            <div className="slds-spinner__dot-b"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingLeft: 5, paddingRight: 5 }}>
      <div className="activity-detail slds-grid slds-m-bottom_medium">
        <div className="slds-col slds-size_1-of-2 slds-p-right_small activity-name-container">
          <Input
            id={"activityName"}
            label="Nom de l'activité"
            defaultValue={activityName}
            onChange={(e) => setActivityName(e.target.value)}
            required={true}
            error={isNull(activityName)}
            disabled={!editable}
          />
        </div>

        <div className="slds-col slds-size_1-of-2 slds-p-right_small activity-name-container">
          <Input
            id={"activityDescription"}
            label="Description"
            defaultValue={activityDescription}
            onChange={(e) => setActivityDescription(e.target.value)}
            disabled={!editable}
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
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e)}
            error={isNull(selectedEvent)}
            isDisabled={!editable}
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
            value={selectedLoyaltyAccount}
            onChange={(e) => setSelectedLoyaltyAccount(e)}
            error={isNull(selectedLoyaltyAccount)}
            isDisabled={!editable}
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
            value={selectedLoyaltyStore}
            onChange={(e) => setSelectedLoyaltyStore(e)}
            error={isNull(selectedLoyaltyStore)}
            isDisabled={!editable}
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
          <div style={{ flex: 1, height: "80px" }}>
            <SearchableSelect
              components={{ DropdownIndicator: DatabaseDropdownIndicator }}
              id="loyaltyEventDateSelect"
              options={entryDEFields}
              label="Date de l'événements"
              required={true}
              isCreatable={true}
              onChange={(e) => setSelectedLoyaltyEventDateSelect(e)}
              value={selectedLoyaltyEventDateSelect}
              error={isNull(selectedLoyaltyEventDateSelect)}
              isDisabled={!editable}
            />
          </div>
          <div
            className=""
            style={{
              display: "flex",
              alignItems: "top",
              justifyContent: "center",
              marginTop: "10px",
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
              value={selectedLoyaltyPoints}
              onChange={(e) => setSelectedLoyaltyPoints(e)}
              error={isNull(selectedLoyaltyPoints) && isDynamicEvent}
              isDisabled={!editable}
            />
          </div>
        )}
      </div>
      {import.meta.env.DEV && (
        <div>
          <button onClick={save}>DEV Save</button>
        </div>
      )}
    </div>
  );
}
