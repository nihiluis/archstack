import React from "react"

import Head from "next/head"
import { Formik, FormikErrors } from "formik"

import { SITE_TITLE, PRODUCT_NAME } from "../src/constants/env"
import * as Logo from "../public/logo.svg"
import Layout from "../src/components/Layout"

interface FormValues {
  mail: string
  password: string
}

function validate(values: FormValues): FormikErrors<FormValues> {
  return {}
}

export default function Home() {
  const submit = function (values: FormValues) {}

  return (
    <Layout>
      <h2 className="title-big">Log in to {PRODUCT_NAME}</h2>
      <Formik<FormValues>
        initialValues={{ mail: "", password: "" }}
        validate={validate}
        onSubmit={submit}>
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-row">
              <label className="form-label">Mail</label>
              <input
                className="form-input"
                type="email"
                name="mail"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.mail}
              />
              {errors.mail && touched.mail && errors.mail}
            </div>
            <div className="form-row">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
              />
              {errors.password && touched.password && errors.password}
            </div>
            <button
              type="submit"
              className="btn btn-primary form-btn"
              disabled={isSubmitting}>
              Submit
            </button>
          </form>
        )}
      </Formik>
    </Layout>
  )
}
