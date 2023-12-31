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
import React, { useState } from "react";

interface DayDetails {
  date: Date | string;
  totalHour: number;
  isPublicHoliday: boolean;
}

interface FormValues {
  baseSalary: number;
  daysExtraWork: Array<DayDetails>;
}

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
      className="rounded-md border border-gray-300 px-4 py-2 text-right"
    />
  );
};

export default function Home() {
  const [totalUang, setTotalUang] = useState(0);

  const submitHandler = (values: FormValues) => {
    let lemburWorkday = 0,
      lemburHoliday = 0,
      totalLembur = 0;
    for (const days of values.daysExtraWork) {
      const theDate = new Date(days.date);
      if (theDate.getDay() === 6 || theDate.getDay() === 0)
        days.isPublicHoliday = true;
    }

    for (const days of values.daysExtraWork) {
      if (days.isPublicHoliday) {
        lemburHoliday += days.totalHour;
      } else lemburWorkday += days.totalHour;
    }

    // hitung biaya lembur per jam
    const perJam = values.baseSalary / 173;

    if (lemburWorkday > 1) {
      totalLembur += (lemburWorkday / 2) * perJam * 1.5;
      totalLembur += (lemburWorkday / 2) * perJam * 2;
    } else {
      totalLembur += perJam * lemburWorkday;
    }

    if (lemburHoliday > 8) {
      totalLembur += 8 * perJam * 2;
      lemburHoliday -= 8;
      if (lemburHoliday > 1) {
        totalLembur += lemburHoliday * perJam * 3;
        lemburHoliday -= 1;
      }
      if (lemburHoliday > 0) {
        totalLembur += lemburHoliday * perJam * 4;
      }
    } else {
      totalLembur += lemburHoliday * perJam * 2;
    }

    setTotalUang(totalLembur);
  };

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-grey flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <div>Kalkulator Lembur</div>
          <Formik
            initialValues={{
              baseSalary: 0,
              daysExtraWork: [
                {
                  date: "",
                  totalHour: 0,
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
                submitHandler(values);
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
                <table className="rounded-md border border-gray-300 p-7">
                  <thead>
                    <tr>
                      <td>No</td>
                      <td>Tanggal</td>
                      <td>Total Jam</td>
                      <td>Hari libur nasional?</td>
                      <td></td>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    <FieldArray
                      name="daysExtraWork"
                      render={(arrayHelpers: {
                        remove: (arg0: number) => void;
                        push: (arg0: {
                          date: string;
                          totalHour: number;
                          isPublicHoliday: boolean;
                        }) => void;
                      }) => {
                        return (
                          <React.Fragment>
                            {values.daysExtraWork.length > 0 ? (
                              values.daysExtraWork.map((_, index) => (
                                <React.Fragment key={index}>
                                  <tr>
                                    <td>{index + 1}</td>
                                    <td>
                                      <Field
                                        type="date"
                                        id={`daysExtraWork.${index}.date`}
                                        name={`daysExtraWork.${index}.date`}
                                        onChange={(e: {
                                          target: { value: string };
                                        }) => {
                                          void setFieldValue(
                                            `daysExtraWork.${index}.date`,
                                            e.target.value
                                          );
                                        }}
                                      />
                                    </td>
                                    <td>
                                      <Field
                                        id={`daysExtraWork.${index}.totalHour`}
                                        name={`daysExtraWork.${index}.totalHour`}
                                        className="rounded-md border border-gray-300 px-4 py-2 text-right"
                                      />
                                    </td>
                                    <td>
                                      <Field
                                        type="checkbox"
                                        id={`daysExtraWork.${index}.isPublicHoliday`}
                                        name={`daysExtraWork.${index}.isPublicHoliday`}
                                      />
                                    </td>
                                    <td>
                                      <button
                                        type="button"
                                        className="mb-2 mr-2 rounded-lg bg-red-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-700 dark:bg-red-500 dark:hover:bg-red-700 dark:focus:ring-red-900"
                                        onClick={() =>
                                          arrayHelpers.remove(index)
                                        }
                                      >
                                        Hapus
                                      </button>
                                    </td>
                                  </tr>
                                  {index ===
                                    values.daysExtraWork.length - 1 && (
                                    <tr>
                                      <td colSpan={5} className="text-center">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            arrayHelpers.push({
                                              date: "",
                                              totalHour: 0,
                                              isPublicHoliday: false,
                                            })
                                          }
                                          className="mb-2 mr-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                                        >
                                          Tambah hari lembur
                                        </button>
                                      </td>
                                    </tr>
                                  )}
                                </React.Fragment>
                              ))
                            ) : (
                              <tr>
                                <td>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      arrayHelpers.push({
                                        date: "",
                                        totalHour: 0,
                                        isPublicHoliday: false,
                                      })
                                    }
                                  >
                                    Add a date
                                  </button>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      }}
                    ></FieldArray>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={5} className="text-right">
                        <button
                          type="submit"
                          className="mb-2 mr-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                          Submit
                        </button>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </Form>
            )}
          </Formik>
        </div>
        {totalUang > 0 && (
          <span>
            total lembur anda {Math.floor(totalUang).toLocaleString()}
          </span>
        )}
      </main>
    </>
  );
}
