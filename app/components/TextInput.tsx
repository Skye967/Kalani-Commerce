import React from "react";

type Props = {
    className: string,
  string: string;
  placeholder: string;
  error: string;
  onUpdate: Function;
};

function TextInput(props: Props) {
  return (
    <>
      <input
        placeholder={props.placeholder}
              className="w-full bg-white text-gray-800 border text-sm p-3 border-[#272727] placeholder-gray-500 focus:outine-none"
              value={props.string || ''}
              onChange={(event) => props.onUpdate(event.target.value)}
              type="text"
              autoComplete="off"
          />
          <div className="text-red-500 text-[14px] font-semibold">
              {props.error ? (props.error) : null}
          </div>
    </>
  );
}

export default TextInput;
