"use client";
import Head from "next/head";
import {
  Formik,
  Field,
  Form,
  type FormikHelpers,
  FieldArray,
  type FieldProps,
  type FormikProps,
} from "formik";
// TODO add zod
// import { z } from "zod";

interface DayDetails {
  date: Date | string;
  totalHour: number;
  isWeekend: boolean;
  isPublicHoliday: boolean;
}

interface FormValues {
  baseSalary: number;
  daysExtraWork: Array<DayDetails>;
}

const isWeekend = (date: string): boolean => {
  const dateObj = new Date(date);
  // const datetime = z.string().datetime();
  // if (!datetime.parse(date)) date = new Date(date);
  return dateObj.getDay() === 6 || dateObj.getDay() === 0;
};

// const formatDateToISO = (date: Date) => {
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
//   const day = String(date.getDate()).padStart(2, "0");
//   return `${year}-${month}-${day}`;
// };

interface NumberInputProps extends FieldProps {
  form: FormikProps<unknown>; // Replace 'any' with the type of your form values
}
const NumberInput: React.FC<NumberInputProps> = ({ field, form }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/,/g, ""); // Remove existing thousand separators
    void form.setFieldValue(field.name, value);
  };

  const formattedValue = Number(field.value).toLocaleString();

  return (
    <input
      type="text"
      {...field}
      value={formattedValue}
      onChange={handleChange}
      className="text-right"
    />
  );
};

export default function Home() {
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-grey flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <div>Kalkulator Pajak</div>
          <Formik
            initialValues={{
              baseSalary: 0,
              daysExtraWork: [
                {
                  date: "",
                  totalHour: 0,
                  isWeekend: false,
                  isPublicHoliday: false,
                },
              ],
            }}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            onSubmit={(
              values: FormValues,
              { setSubmitting }: FormikHelpers<FormValues>
            ) => {
              setTimeout(() => {
                alert(JSON.stringify(values, null, 2));
                setSubmitting(false);
              }, 500);
            }}
          >
            {({ values, setFieldValue }) => (
              <Form className="flex max-w-lg flex-col gap-4">
                <div>
                  <label htmlFor="base-salary" className="pr-2">
                    Gaji Pokok + Tunjangan Tetap
                  </label>
                  <Field
                    id="baseSalary"
                    name="baseSalary"
                    className="rounded-md border border-gray-300 px-4 py-2 text-right"
                    component={NumberInput}
                  />
                </div>
                <div className="flex flex-row items-center gap-4">
                  <span>No</span>
                  <span>Tanggal</span>
                  <span>Total Jam</span>
                  <span>Hari libur nasional?</span>
                  <span>Hapus</span>
                </div>
                <FieldArray
                  name="daysExtraWork"
                  render={(arrayHelpers: {
                    remove: (arg0: number) => void;
                    push: (arg0: {
                      date: string;
                      totalHour: number;
                      isWeekend: boolean;
                      isPublicHoliday: boolean;
                    }) => void;
                  }) => {
                    return (
                      <>
                        {values.daysExtraWork.length > 0 ? (
                          values.daysExtraWork.map((_, index) => (
                            <div key={index}>
                              <div className="flex flex-row items-center gap-4">
                                <label>hari ke-{index}</label>
                                <Field
                                  type="date"
                                  id={`daysExtraWork.${index}.date`}
                                  name={`daysExtraWork.${index}.date`}
                                  onChange={(e: {
                                    target: { value: string };
                                  }) => {
                                    const isThisWeekend = isWeekend(
                                      e.target.value
                                    );
                                    void setFieldValue(
                                      `daysExtraWork.${index}.isWeekend`,
                                      isThisWeekend
                                    );
                                    void setFieldValue(
                                      `daysExtraWork.${index}.date`,
                                      e.target.value
                                    );
                                  }}
                                />
                                <Field
                                  id={`daysExtraWork.${index}.totalHour`}
                                  name={`daysExtraWork.${index}.totalHour`}
                                  className="rounded-md border border-gray-300 px-4 py-2 text-right"
                                />
                                <Field
                                  type="checkbox"
                                  id={`daysExtraWork.${index}.isHoliday`}
                                  name={`daysExtraWork.${index}.isHoliday`}
                                />
                                <button
                                  type="button"
                                  onClick={() => arrayHelpers.remove(index)}
                                >
                                  -
                                </button>
                              </div>
                              {index === values.daysExtraWork.length - 1 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    arrayHelpers.push({
                                      date: "",
                                      totalHour: 0,
                                      isWeekend: false,
                                      isPublicHoliday: false,
                                    })
                                  }
                                >
                                  +
                                </button>
                              )}
                            </div>
                          ))
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              arrayHelpers.push({
                                date: "",
                                totalHour: 0,
                                isWeekend: false,
                                isPublicHoliday: false,
                              })
                            }
                          >
                            Add a date
                          </button>
                        )}
                      </>
                    );
                  }}
                ></FieldArray>
                {/* TODO work on submit */}
                <button type="submit">Submit</button>
              </Form>
            )}
          </Formik>
        </div>
      </main>
    </>
  );
}
