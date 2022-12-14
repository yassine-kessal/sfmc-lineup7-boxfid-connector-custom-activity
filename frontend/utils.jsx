import { components } from "react-select";

/**
 * Get all event schema fields from the payload
 *
 * @param payload
 * @returns {*[]}
 */
const getEventSchemaFields = (payload) => {
  const fields = [];

  for (const field of payload.schema) {
    /**
     * If the field is not a data extension field, skip it
     */
    if (!field.key.startsWith("Event.")) continue;

    /**
     * Add the field to the fields array
     */
    fields.push({
      value: "{{" + field.key + "}}",
      label: field.key.substring(field.key.lastIndexOf(".") + 1),
    });
  }

  return fields;
};

const DatabaseDropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <svg
        width="16.000000pt"
        height="16.000000pt"
        viewBox="0 0 52.000000 52.000000"
      >
        <g
          transform="translate(0.000000,52.000000) scale(0.100000,-0.100000)"
          fill="#b3b3b3"
          stroke="none"
        >
          <path
            d="M188 489 c-32 -4 -71 -15 -88 -24 -26 -14 -31 -21 -28 -48 5 -52 57
-72 188 -72 131 0 183 20 188 72 3 27 -2 34 -27 47 -24 13 -152 38 -171 35 -3
-1 -31 -5 -62 -10z"
          />
          <path
            d="M70 304 c0 -20 9 -29 48 -47 67 -30 217 -30 285 0 38 18 47 27 47 47
0 14 -1 26 -2 26 -2 0 -21 -7 -43 -15 -54 -19 -236 -19 -290 0 -22 8 -41 15
-42 15 -2 0 -3 -12 -3 -26z"
          />
          <path
            d="M72 202 c5 -47 63 -67 188 -67 125 0 183 20 188 67 l3 27 -33 -17
c-48 -25 -268 -25 -316 0 l-33 17 3 -27z"
          />
          <path
            d="M70 100 c0 -46 70 -72 190 -72 120 0 190 26 190 72 0 18 -2 18 -37 3
-53 -23 -253 -23 -305 0 -36 15 -38 15 -38 -3z"
          />
        </g>
      </svg>
    </components.DropdownIndicator>
  );
};

const DatePickerIcon = () => {
  return (
    <svg
      width="18.000000pt"
      height="18.000000pt"
      viewBox="0 0 52.000000 52.000000"
      preserveAspectRatio="xMidYMid meet"
    >
      <g
        transform="translate(0.000000,52.000000) scale(0.100000,-0.100000)"
        fill="#b3b3b3"
        stroke="none"
      >
        <path
          d="M130 465 c-7 -19 -17 -25 -40 -25 -24 0 -33 -6 -40 -26 -6 -14 -8
-30 -4 -35 3 -5 99 -9 215 -9 224 0 234 2 209 49 -7 14 -21 21 -41 21 -22 0
-32 6 -39 25 -6 15 -17 25 -30 25 -13 0 -22 -9 -26 -25 -6 -24 -10 -25 -74
-25 -64 0 -68 1 -74 25 -4 16 -13 25 -26 25 -13 0 -24 -10 -30 -25z"
        />
        <path
          d="M44 306 c-3 -8 -4 -69 -2 -136 2 -94 6 -123 18 -130 20 -13 380 -13
400 0 12 7 15 35 15 142 l0 133 -213 3 c-179 2 -213 0 -218 -12z m244 -78 c-2
-27 -7 -33 -27 -33 -28 0 -47 25 -38 49 4 10 18 16 37 16 29 0 31 -2 28 -32z
m110 0 c-2 -27 -7 -33 -27 -33 -28 0 -47 25 -38 49 4 10 18 16 37 16 29 0 31
-2 28 -32z m-211 -94 c9 -24 -10 -49 -38 -49 -20 0 -25 6 -27 33 -3 30 -1 32
28 32 19 0 33 -6 37 -16z m101 -16 c-2 -27 -7 -33 -27 -33 -28 0 -47 25 -38
49 4 10 18 16 37 16 29 0 31 -2 28 -32z"
        />
      </g>
    </svg>
  );
};

export { getEventSchemaFields, DatabaseDropdownIndicator, DatePickerIcon };
