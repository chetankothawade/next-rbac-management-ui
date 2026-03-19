
/**
 * Unified form field renderer for React Hook Form.
 * Renders the correct input based on `field.type`
 * and applies validation, errors, and formatting automatically.
 */
import { Controller } from "react-hook-form";
import { useState } from "react";
import Flatpickr from "react-flatpickr";
import { Form, InputGroup, Button } from "react-bootstrap";
import Select from "react-select";
import MultiSelect from "../MultiSelect";
import CustomEditor from "../CustomEditor";
import { formatPhone } from "../../../src/utils/helpers";


export default function FormField({
    field = {},
    control,
    register = () => ({}),
    errors = {},
    touchedFields = {}
}) {
    const [showPassword, setShowPassword] = useState(false);
    // REQUIRED SAFETY CHECK
    if (!field?.name && !["date_number_pair", "readonly"].includes(field.type)) {
        console.warn("❌ FormField missing name:", field);
        return null;
    }

    const {
        type,
        name,
        nameDate,
        nameNumber,
        label,
        options = [],
        placeholder,
        rules = {},
        inline,
        col,
        disabled,
        readOnly,
        readonly,   // allow either spelling
        numberProps = {},
        suffix,
        prefix,
        value,
        required,
        min,
        max,
        maxLength,
        minLength,
        step
    } = field;

    const isReadonly = !!(readonly || readOnly);

    const colClass = typeof col === "object"
        ? Object.entries(col).map(([bp, size]) => `col-${bp}-${size}`).join(" ")
        : `col-${col || 12}`;

    const error = errors?.[name];
    const touched = touchedFields?.[name];

    const baseProps = {
        isInvalid: !!error,
        isValid: touched && !error
    };

    const Feedback = () =>
        error && (
            <Form.Control.Feedback type="invalid" className="d-block">
                {error.message}
            </Form.Control.Feedback>
        );

    const FieldLabel = () => (
        <Form.Label htmlFor={name || nameDate}>
            {label}
            {(rules?.required || required) && <span className="text-danger">*</span>}
        </Form.Label>
    );


    // -------------------------------------------------------
    // CHECKBOX (Single)
    // -------------------------------------------------------
    if (type === "checkbox") {
        return (
            <Form.Group className={`${colClass} mb-3`}>
                <Form.Check
                    label={<>{label} {rules?.required && <span className="text-danger">*</span>}</>}
                    type="checkbox"
                    disabled={disabled}
                    readOnly={isReadonly}
                    {...register(name, rules)}
                    {...baseProps}
                    onClick={(e) => isReadonly && e.preventDefault()}
                />
                <Feedback />
            </Form.Group>
        );
    }

    // -------------------------------------------------------
    // CHECKBOX GROUP
    // -------------------------------------------------------
    if (type === "checkbox_group") {
        return (
            <Form.Group className={`${colClass} mb-3`}>
                <FieldLabel />
                <Controller
                    name={name}
                    control={control}
                    rules={rules}
                    render={({ field }) => {
                        const selected = field.value || [];

                        const toggleValue = (val) => {
                            if (isReadonly) return;
                            const exists = selected.includes(val);
                            const updated = exists
                                ? selected.filter((v) => v !== val)
                                : [...selected, val];
                            field.onChange(updated);
                        };

                        return options.map(({ label: optLabel, value }) => (
                            <Form.Check
                                key={value}
                                type="checkbox"
                                label={optLabel}
                                inline={inline}
                                disabled={disabled}
                                checked={selected.includes(value)}
                                onChange={() => toggleValue(value)}
                            />
                        ));
                    }}
                />
                <Feedback />
            </Form.Group>
        );
    }


    // -------------------------------------------------------
    // RADIO GROUP
    // -------------------------------------------------------
    if (type === "radio") {
        return (
            <Form.Group className={`${colClass} mb-3`}>
                <FieldLabel />
                <div>
                    {options.map((opt) => (
                        <Form.Check
                            inline
                            type="radio"
                            key={opt.value}
                            label={opt.label}
                            value={opt.value}
                            disabled={disabled}
                            onClick={(e) => isReadonly && e.preventDefault()}
                            {...register(name, rules)}
                            {...baseProps}
                        />
                    ))}
                </div>
                <Feedback />
            </Form.Group>
        );
    }

    // -------------------------------------------------------
    // BASIC SELECT
    // -------------------------------------------------------
    if (type === "select" || type === "select_basic") {
        return (
            <Form.Group className={`${colClass} mb-3`}>
                <FieldLabel />
                <Form.Select
                    disabled={disabled}
                    {...register(name, rules)}
                    {...baseProps}
                >
                    {(type === "select_basic") && <option value="">-- Select --</option>}
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </Form.Select>
                <Feedback />
            </Form.Group>
        );
    }

    // -------------------------------------------------------
    // MULTISELECT
    // -------------------------------------------------------

    if (type === "multiselect") {
        return (
            <Form.Group className={`${colClass} mb-3`} data-field={name}>
                <FieldLabel />

                <Controller
                    name={name}
                    control={control}
                    rules={rules}
                    render={({ field }) => {
                        const rawVal = field.value;
                        const selectedIds = Array.isArray(rawVal)
                            ? rawVal
                            : rawVal
                                ? [rawVal]
                                : [];

                        return (
                            <MultiSelect
                                id={name}
                                options={options}
                                isDisabled={disabled}
                                isSelectAll
                                value={options.filter(o => selectedIds.includes(o.value))}
                                onChange={(val) => {
                                    const ids = val.map(v => v.value);
                                    !isReadonly && field.onChange(ids.length ? ids : []);
                                }}
                                placeholder={placeholder || "-- Select --"}
                                className={`nack-reacte-slect ${error ? "is-invalid" : ""}`}
                            />
                        );
                    }}
                />
                <Feedback />
            </Form.Group>
        );
    }


    // -------------------------------------------------------
    // REACT SELECT
    // -------------------------------------------------------
    if (type === "react_select") {
        return (
            <Form.Group className={`${colClass} mb-3`} data-field={name}>
                <FieldLabel />
                <Controller
                    name={name}
                    control={control}
                    rules={rules}
                    render={({ field }) => (
                        <Select
                            value={options.find((opt) => opt.value === field.value) || null}
                            options={options}
                            placeholder={placeholder || "Select"}
                            isDisabled={disabled}
                            onChange={(opt) => !isReadonly && field.onChange(opt?.value ?? null)}
                            className={`nack-reacte-slect ${error ? "is-invalid" : ""}`}
                            classNamePrefix="nack-rs"
                        />
                    )}
                />
                <Feedback />
            </Form.Group>
        );
    }

    // -------------------------------------------------------
    // DATE PICKER
    // -------------------------------------------------------
    if (type === "date") {
        return (
            <Form.Group className={`${colClass} mb-3`} data-field={name}>
                <FieldLabel />
                <Controller
                    name={name}
                    control={control}
                    rules={rules}
                    render={({ field }) => (
                        <InputGroup>
                            <Flatpickr
                                value={field.value ? new Date(field.value) : null}
                                onChange={([date]) => {
                                    if (!date) return field.onChange(null);
                                    const d = new Date(date);
                                    field.onChange(
                                        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
                                    );
                                }}
                                disabled={disabled}
                                placeholder={placeholder}
                                options={{
                                    dateFormat: "d-m-Y",
                                    disableMobile: true,
                                    clickOpens: !isReadonly
                                }}
                                className={`form-control ${error ? "is-invalid" : ""}`}
                            />
                            <InputGroup.Text><i className="ri-calendar-line"></i></InputGroup.Text>
                        </InputGroup>
                    )}
                />
                <Feedback />
            </Form.Group>
        );
    }

    // -------------------------------------------------------
    // DATE + NUMBER PAIR (Penalty)
    // -------------------------------------------------------
    if (type === "date_number_pair") {
        return (
            <Form.Group className={`${colClass} mb-3`}>
                <FieldLabel />
                <InputGroup>
                    <Controller
                        name={nameDate}
                        control={control}
                        rules={rules}
                        render={({ field }) => (
                            <Flatpickr
                                value={field.value ? new Date(field.value) : null}
                                onChange={([date]) => {
                                    if (!date) return field.onChange(null);
                                    const d = new Date(date);
                                    field.onChange(
                                        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
                                    );
                                }}
                                disabled={disabled}
                                options={{
                                    dateFormat: "d-m-Y",
                                    disableMobile: true,
                                    clickOpens: !isReadonly
                                }}
                                className={`form-control ${errors?.[nameDate] ? "is-invalid" : ""}`}
                                placeholder="Select date"
                            />
                        )}
                    />

                    <InputGroup.Text><i className="ri-calendar-line"></i></InputGroup.Text>

                    <Controller
                        name={nameNumber}
                        control={control}
                        rules={rules}
                        render={({ field }) => (
                            <Form.Control
                                {...field}
                                type="number"
                                disabled={disabled}
                                readOnly={isReadonly}
                                {...numberProps}
                                className={`text-end ${errors?.[nameNumber] ? "is-invalid" : ""}`}
                                style={{ maxWidth: "100px" }}
                                data-field={nameNumber}
                            />
                        )}
                    />

                    <InputGroup.Text>{suffix}</InputGroup.Text>
                </InputGroup>

                {errors?.[nameDate] && <div className="text-danger">{errors[nameDate]?.message}</div>}
                {errors?.[nameNumber] && <div className="text-danger">{errors[nameNumber]?.message}</div>}
            </Form.Group>
        );
    }

    // -------------------------------------------------------
    // READONLY DISPLAY
    // -------------------------------------------------------
    if (type === "readonly") {
        return (
            <Form.Group className={`${colClass} mb-3`}>
                <FieldLabel />
                <InputGroup>
                    {prefix && <InputGroup.Text>{prefix}</InputGroup.Text>}
                    <Form.Control value={value ?? ""} readOnly />
                </InputGroup>
            </Form.Group>
        );
    }

    // -------------------------------------------------------
    // PHONE
    // -------------------------------------------------------
    if (type === "phone") {
        return (
            <Form.Group className={`${colClass} mb-3`}>
                <FieldLabel />
                <Controller
                    name={name}
                    id={name}
                    control={control}
                    rules={rules}
                    render={({ field }) => (
                        <Form.Control
                            {...field}
                            placeholder={placeholder || "999-999-9999"}
                            disabled={disabled}
                            readOnly={isReadonly}
                            maxLength={15}
                            onChange={(e) => {
                                if (!isReadonly) {
                                    const raw = e.target.value.replace(/\D/g, "");   // keep digits only
                                    const formatted = formatPhone(raw);              // optional mask fn
                                    field.onChange(formatted);
                                }
                            }}
                            value={field.value || ""}
                            {...baseProps}
                        />
                    )}
                />

                <Feedback />
            </Form.Group>
        );
    }

    // -------------------------------------------------------
    // RICH TEXT EDITOR
    // -------------------------------------------------------

    if (type === "editor" || type === "ckeditor") {
        return (
            <Form.Group className={`${colClass} mb-3`} data-field={name}>
                <FieldLabel />
                <Controller
                    name={name}
                    control={control}
                    rules={rules}
                    render={({ field }) => (
                        <CustomEditor
                            value={field.value || ""}
                            onChange={(val) => {
                                if (!isReadonly) field.onChange(val);
                            }}
                            readOnly={isReadonly}
                        />
                    )}
                />

                <Feedback />
            </Form.Group>
        );
    }

    /** FILE INPUT (single or multiple) */
    if (type === "file") {
        //Check Later
        //file preview
        //remove button
        //image thumbnail
        //Set accept type //accept: ".pdf,.docx,.jpg"
        //auto upload to API / S3
        return (
            <Form.Group className={`${colClass} mb-3`}>
                <FieldLabel />
                <Controller
                    name={name}
                    id={name}
                    control={control}
                    rules={rules}
                    render={({ field }) => (
                        <Form.Control
                            type="file"
                            disabled={disabled}
                            readOnly={isReadonly}
                            multiple={field.multiple || field?.multiple}
                            onChange={(e) => {
                                if (!isReadonly) {
                                    const fileList = e.target.files;
                                    field.onChange(field.multiple ? Array.from(fileList) : fileList[0]);
                                }
                            }}
                            {...baseProps}
                        />
                    )}
                />
                <Feedback />
            </Form.Group>
        );
    }
    // -------------------------------------------------------
    // DEFAULT INPUT (text, textarea, number...)
    // -------------------------------------------------------
    if (type === "password") {
        return (
            <Form.Group className={`${colClass} mb-3`}>
                <FieldLabel />
                <InputGroup>
                    {prefix && <InputGroup.Text>{prefix}</InputGroup.Text>}
                    <Form.Control
                        {...register(name, rules)}
                        id={name}
                        placeholder={placeholder}
                        disabled={disabled}
                        readOnly={isReadonly}
                        type={showPassword ? "text" : "password"}
                        {...(min ? { min } : {})}
                        {...(max ? { max } : {})}
                        {...(maxLength ? { maxLength } : {})}
                        {...(minLength ? { minLength } : {})}
                        {...baseProps}
                    />
                    <Button
                        variant="outline-secondary"
                        onClick={() => setShowPassword((v) => !v)}
                        tabIndex={-1}
                    >
                        <i className={showPassword ? "ri-eye-off-fill" : "ri-eye-fill"} />
                    </Button>
                    {suffix && <InputGroup.Text>{suffix}</InputGroup.Text>}
                </InputGroup>
                <Feedback />
            </Form.Group>
        );
    }

    return (
        <Form.Group className={`${colClass} mb-3`}>
            <FieldLabel />
            <InputGroup>
                {prefix && <InputGroup.Text>{prefix}</InputGroup.Text>}
                <Form.Control
                    {...register(name, rules)}
                    id={name}
                    placeholder={placeholder}
                    disabled={disabled}
                    readOnly={isReadonly}
                    type={type === "textarea" ? undefined : type}
                    as={type === "textarea" ? "textarea" : "input"}
                    rows={type === "textarea" ? 3 : undefined}
                    {...(min ? { min } : {})}
                    {...(max ? { max } : {})}
                    {...(step ? { step } : {})}
                    {...(maxLength ? { maxLength } : {})}
                    {...(minLength ? { minLength } : {})}
                    {...baseProps}
                />

            </InputGroup>
            <Feedback />
        </Form.Group>
    );
}





















































/* USAGE EXAMPLE */


// import { useForm, Controller } from "react-hook-form";
// import FormField from "./FormField";
// import { Button, Form } from "react-bootstrap";

// export default function ExampleForm() {
//     const {
//         control,
//         register,
//         handleSubmit,
//         formState: { errors, touchedFields }
//     } = useForm({
//         defaultValues: {
//             name: "",
//             description: "",
//             age: "",
//             accept: false,
//             channels: [],
//             gender: "",
//             country: "",
//             roles: [],
//             designation: "",
//             dob: null
//         }
//     });

//     // ALL field definitions
//     const fields = [
//         /** TEXT */
//         { type: "text", name: "name", label: "Full Name", placeholder: "John Doe", rules: { required: "Name required" }, col: 6 },

//         /** TEXTAREA */
//         { type: "textarea", name: "description", label: "Description", placeholder: "Tell something..." },

/** PHONE */
//         { name: "phone", label: "Mobile", type: "phone", col: { md: 4, lg: 3 } }

//         /** NUMBER */
//         { type: "number", name: "age", label: "Age", rules: { required: "Age required" }, col: { md: 6, lg: 4 } },

//         /** CHECKBOX */
//         { type: "checkbox", name: "accept", label: "Accept Terms", rules: { required: "Required" } },

//         /** CHECKBOX GROUP */
//         {
//             type: "checkbox_group",
//             name: "channels",
//             label: "Preferred Channels",
//             inline: true,
//             options: [
//                 { value: "email", label: "Email" },
//                 { value: "sms", label: "SMS" },
//                 { value: "call", label: "Phone Call" },
//             ],
//             rules: { required: "Pick at least one" }
//         },

//         /** RADIO */
//         {
//             type: "radio",
//             name: "gender",
//             label: "Gender",
//             inline: true,
//             options: ["Male", "Female", "Other"],
//             rules: { required: "Gender required" }
//         },

//         /** SELECT */
//         {
//             type: "select",
//             name: "country",
//             label: "Country",
//             options: [
//                 { value: "in", label: "India" },
//                 { value: "us", label: "USA" },
//                 { value: "uk", label: "UK" }
//             ],
//             rules: { required: "Country required" }
//         },

//         /** MULTISELECT (your custom MultiSelect) */
//         {
//             type: "multiselect",
//             name: "roles",
//             label: "Roles",
//             options: [
//                 { value: "admin", label: "Admin" },
//                 { value: "editor", label: "Editor" },
//                 { value: "viewer", label: "Viewer" }
//             ],
//             rules: { required: "Pick at least 1 role" }
//         },

//         /** REACT SELECT (single) */
//         {
//             type: "react_select",
//             name: "designation",
//             label: "Designation",
//             placeholder: "Choose...",
//             options: [
//                 { value: "pm", label: "Project Manager" },
//                 { value: "dev", label: "Developer" },
//                 { value: "qa", label: "QA Engineer" }
//             ]
//         },

//         /** DATE */
//         {
//             type: "date",
//             name: "dob",
//             label: "Date of Birth",
//             rules: { required: "Birthdate required" }
//         }
/** file */
// {
// type: "file",
// name: "document",
// label: "Upload Document",
// rules: { required: "Please upload a file" }
// }

//multiple file

// {
// type: "file",
// name: "attachments",
// label: "Attach Files",
// multiple: true,
// rules: { required: "Select at least one file" }
// }


//     ];

//     const onSubmit = (data) => console.log("submitted", data);

//     return (
// <Form onSubmit={handleSubmit(onSubmit)}>
//     <Row>
//         {fields.map((fld) => (
//             <FormField
//                 key={fld.name}
//                 field={fld}
//                 control={control}
//                 register={register}
//                 errors={errors}
//                 touchedFields={touchedFields}
//             />
//         ))}
//     </Row>

//     <Button type="submit">Submit</Button>
// </Form>

//     );
// }
