import React, { useState, useContext } from "react"
import * as Yup from "yup"
import { Formik, Form, Field } from "formik"
import { useHistory, useParams } from "react-router-dom"
import { NearContext } from "../../commons/context/NearContext"
import ipfs from "../../commons/ipfs"
import { FocusError, SubmittingWheel } from "../../commons/FocusWheel"
import Ipfsadd from "../../commons/TextileIO"
import TagsInput from "./TagsInput"
import DropProductImage from "./DropProductImage"
import DropProductPDFs from "./DropProductPDFs"

function CreateProduct(props) {
  // const [count, setCount] = useState(0);
  let history = useHistory()
  const {pt} = useParams()
  let { nearvar } = useContext(NearContext)
  const [errorThrow, setErrorThrow] = useState(false)
  const selectedTags = (tags) => {
    console.log(tags)
  }

  return (
    <React.Fragment>
      <div className="container">
        <Formik
          initialValues={{
            headline: "",
            productimage: "",
            details: "",
            video: "",
            specialization: "",
          }}
          validationSchema={Yup.object().shape({
            headline: Yup.string().required("headline is required"),
            productimage: Yup.string().required("Image is required and it should be JPG or PNG"),
            details: Yup.string().required("Details is required"),
            video: Yup.string(),
            specialization: Yup.string().required("specialization is required"),
          })}
          onSubmit={async (values, actions) => {
            //   values.countvariable = count
            try {
              const profile_type = pt
              // console.log(values)
              // console.log(pt)
              const file = await ipfs.add({
                path: "product.json",
                content: JSON.stringify(values),
              })
              await nearvar.contract.create_product({
                product_details_hash: file.cid.string,
                product_type: profile_type,
              })

              // const content = JSON.stringify(values);
              // const filename = "product.json"
              // const data = await Ipfsadd(content, filename)
              // await nearvar.contract.create_product({ product_details_hash: data.path.cid.string })
              history.push("/myproducts")
            } catch (e) {
              console.error(e)
              setErrorThrow(e.message)
            }

            // actions.setSubmitting(false)
            // console.log(data)
            // history.push(`/thankyou`)
          }}
        >
          {({
            handleSubmit,
            handleBlur,
            handleChange,
            errors,
            touched,
            isValid,
            isSubmitting,
            values,
            setFieldValue,
            setTouched,
            setFieldTouched,
            validateForm
          }) => (
            <Form onSubmit={handleSubmit}>
              {errorThrow && <p>{errorThrow}</p>}
              <div className="form-group">
                <label htmlFor="headline">headline</label>
                {touched.headline && errors.headline && (
                  <p className="alert alert-danger">{errors.headline}</p>
                )}

                <Field name="headline" className="form-control" />
              </div>

              <label htmlFor="image">Blog Image</label>
              {errors.productimage && touched.productimage && (
                <p className="alert alert-danger">{errors.productimage}</p>
              )}
              <DropProductImage
                name={"productimage"}
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
              />
              {/* <TagsInput selectedTags={selectedTags} name={"audience"} setFieldValue={setFieldValue} tags={['Novice', 'Intermediate']}/> */}

              <div className="form-group">
                <label htmlFor="details">details</label>
                {touched.details && errors.details && (
                  <p className="alert alert-danger">{errors.details}</p>
                )}

                <Field
                  name="details"
                  component="textarea"
                  rows="5"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="Videos">Video</label>
                {touched.video && errors.video && (
                  <p className="alert alert-danger">{errors.video}</p>
                )}
                <DropProductPDFs name={"video"} setFieldValue={setFieldValue} />
              </div>
            

              <div className="form-group">
                <label htmlFor="specialization">specialization</label>
                {touched.specialization && errors.specialization && (
                  <p className="alert alert-danger">{errors.specialization}</p>
                )}
                <TagsInput
                  selectedTags={selectedTags}
                  name={"specialization"}
                  setFieldValue={setFieldValue}
                  tags={["All", "Blockchain"]}
                />
                {/* <TagsInput name="specialization" value={values.specialization} onChange={specialization => {
                  console.log(specialization)
                  setFieldValue("specialization", specialization)
                }} /> */}
              </div>
              <SubmittingWheel isSubmitting={isSubmitting} />
              <div className="text-center">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  Submit Form
                </button>
              </div>
              
              <FocusError />
            </Form>
          )}
        </Formik>
      </div>
    </React.Fragment>
  )
}

export default CreateProduct
