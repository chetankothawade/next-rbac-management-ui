import { useState, useRef } from "react";
import ReactSelect, { components } from "react-select";

const MultiSelect = ({ placeholder = "-- Select --", className = "nack-react-select", classNamePrefix = "nack-rs", ...props }) => {

    const [selectInput, setSelectInput] = useState("");
    const isAllSelected = useRef(false);
    const selectAllLabel = useRef("Select all");
    const allOption = { value: "*", label: selectAllLabel.current };

    const filterOptions = (options, input) =>
        options?.filter(({ label }) =>
            label.toLowerCase().includes(input.toLowerCase())
        );

    const comparator = (v1, v2) => (v1.value ?? 0) - (v2.value ?? 0);

    let filteredOptions = filterOptions(props.options, selectInput);
    let filteredSelectedOptions = filterOptions(props.value, selectInput);

    const Option = (optionProps) => (
        <components.Option {...optionProps}>
            {optionProps.value === "*" &&
                !isAllSelected.current &&
                filteredSelectedOptions?.length > 0 ? (
                <input
                    type="checkbox"
                    ref={(input) => {
                        if (input) input.indeterminate = true;
                    }}
                />
            ) : (
                <input
                    type="checkbox"
                    checked={optionProps.isSelected || isAllSelected.current}
                    onChange={() => { }}
                />
            )}
            <label style={{ marginLeft: 5 }}>{optionProps.label}</label>
        </components.Option>
    );

    const Input = (inputProps) => (
        <>
            {selectInput.length === 0 ? (
                <components.Input
                    autoFocus={inputProps.selectProps.menuIsOpen}
                    {...inputProps}
                >
                    {inputProps.children}
                </components.Input>
            ) : (
                <div style={{ border: "1px dotted gray" }}>
                    <components.Input
                        autoFocus={inputProps.selectProps.menuIsOpen}
                        {...inputProps}
                    >
                        {inputProps.children}
                    </components.Input>
                </div>
            )}
        </>
    );

    const customFilterOption = ({ value, label }, input) =>
        (value !== "*" && label.toLowerCase().includes(input.toLowerCase())) ||
        (value === "*" && filteredOptions?.length > 0);

    const onInputChange = (inputValue, event) => {
        if (event.action === "input-change") setSelectInput(inputValue);
        else if (event.action === "menu-close" && selectInput !== "")
            setSelectInput("");
    };

    const onKeyDown = (e) => {
        if ((e.key === " " || e.key === "Enter") && !selectInput)
            e.preventDefault();
    };

    const handleChange = (selected) => {
        if (
            selected.length > 0 &&
            !isAllSelected.current &&
            (selected[selected.length - 1].value === allOption.value ||
                JSON.stringify(filteredOptions) ===
                JSON.stringify(selected.sort(comparator)))
        ) {
            return props.onChange(
                [
                    ...(props.value ?? []),
                    ...props.options.filter(
                        ({ label }) =>
                            label.toLowerCase().includes(selectInput.toLowerCase()) &&
                            (props.value ?? []).filter((opt) => opt.label === label).length ===
                            0
                    ),
                ].sort(comparator)
            );
        } else if (
            selected.length > 0 &&
            selected[selected.length - 1].value !== allOption.value &&
            JSON.stringify(selected.sort(comparator)) !==
            JSON.stringify(filteredOptions)
        )
            return props.onChange(selected);
        else
            return props.onChange([
                ...props.value?.filter(
                    ({ label }) =>
                        !label.toLowerCase().includes(selectInput.toLowerCase())
                ),
            ]);
    };

    const customStyles = {
        multiValueLabel: (def) => ({
            ...def,
            backgroundColor: "lightgray",
        }),
        multiValueRemove: (def) => ({
            ...def,
            backgroundColor: "lightgray",
        }),
        valueContainer: (base) => ({
            ...base,
            maxHeight: "65px",
            overflow: "auto",
        }),
        option: (styles, { isSelected, isFocused }) => ({
            ...styles,
            // backgroundColor:
            //     isSelected && !isFocused
            //         ? null
            //         : isFocused && !isSelected
            //             ? styles.backgroundColor
            //             : isFocused && isSelected
            //                 ? "#97bbf1ff"
            //                 : null,
        }),
        menu: (def) => ({ ...def, zIndex: 9999 }),
    };

    if (props.isSelectAll && props.options.length !== 0) {
        isAllSelected.current =
            JSON.stringify(filteredSelectedOptions) ===
            JSON.stringify(filteredOptions);

        if (filteredSelectedOptions?.length > 0) {
            if (filteredSelectedOptions.length === filteredOptions.length)
                selectAllLabel.current = `All (${filteredOptions.length}) selected`;
            else
                selectAllLabel.current = `${filteredSelectedOptions.length} / ${filteredOptions.length} selected`;
        } else selectAllLabel.current = "Select all";

        allOption.label = selectAllLabel.current;

        return (
            <ReactSelect
                {...props}
                inputValue={selectInput}
                onInputChange={onInputChange}
                onKeyDown={onKeyDown}
                options={[allOption, ...props.options]}
                onChange={handleChange}
                components={{
                    Option,
                    Input,
                    ...props.components,
                }}
                filterOption={customFilterOption}
                menuPlacement={props.menuPlacement ?? "auto"}
                styles={customStyles}
                isMulti
                closeMenuOnSelect={false}
                tabSelectsValue={false}
                backspaceRemovesValue={false}
                hideSelectedOptions={false}
                blurInputOnSelect={false}
                placeholder={placeholder}
                className={className}
                classNamePrefix={classNamePrefix}

            />
        );
    }

    return (
        <ReactSelect
            {...props}
            inputValue={selectInput}
            onInputChange={onInputChange}
            filterOption={customFilterOption}
            components={{
                Input,
                ...props.components,
            }}
            menuPlacement={props.menuPlacement ?? "auto"}
            onKeyDown={onKeyDown}
            tabSelectsValue={false}
            hideSelectedOptions={true}
            backspaceRemovesValue={false}
            blurInputOnSelect={true}
            placeholder={placeholder}
            className={className}
            classNamePrefix={classNamePrefix}
        />
    );
};

export default MultiSelect;
