import React, { useState, useContext, useEffect } from "react"
import * as Yup from "yup"
import axios from "axios"
import { Formik, Form, Field } from "formik"
import { useHistory, useParams } from "react-router-dom"
import { NearContext } from "../../commons/context/NearContext"
import ipfs from "../../commons/ipfs"
import { FocusError, SubmittingWheel } from "../../commons/FocusWheel"
import Ipfsadd from "../../commons/TextileIO"
import TagsInput from "./TagsInput"
import DropProductImageUpdate from "./DropProductImageUpdate"
import { IPFS_URL } from "../../config/configvar"
import DropProductPDFsUpdate from "./DropProductPDFsUpdate"

function UpdateProduct(props) {
  // const [count, setCount] = useState(0);
  let history = useHistory()
  const { pid } = useParams()
  let { nearvar } = useContext(NearContext)
  const [errorThrow, setErrorThrow] = useState(false)
  const [fetchProductError, setFetchProductError] = useState(false)
  const [productType, setProductType] = useState(null)
  const [ipfsData, setProductData] = useState(null)
  const selectedTags = (tags) => {
    console.log(tags)
  }

  useEffect(() => {
    async function fetchProduct() {
        console.log(pid)
      try {
        let data = await nearvar.contract.get_product_js({
          product_id: pid.toString(),
        })
        console.log(data)
        setProductType(data.product_type)
        const result = await axios(`${IPFS_URL}${data.product_details_hash}`)
        console.log(result.data)
        setProductData(result.data)
      } catch (e) {
        setFetchProductError(e)
        console.error(e)
      }
    }

    fetchProduct()
  }, [])
  if (ipfsData && productType) {
    return (
      <React.Fragment>
        <div className="container">
          <Formik
            initialValues={{
              headline: ipfsData.headline,
              productimage: ipfsData.productimage,
              details: ipfsData.details,
              video: ipfsData.video,
              specialization: ipfsData.specialization,
            }}
            validationSchema={Yup.object().shape({
              headline: Yup.string().required("headline is required"),
              productimage: Yup.string().required("Image is required and it should be JPG or PNG"),
              details: Yup.string().required("Details is required"),
              video: Yup.string(),
              specialization: Yup.string().required(
                "specialization is required"
              )
            })}
            onSubmit={async (values, actions) => {
              //   values.countvariable = count
              try {
                const profile_type = productType
                // console.log(values)
                // console.log(pt)
                const file = await ipfs.add({
                  path: "product.json",
                  content: JSON.stringify(values),
                })
                await nearvar.contract.update_product({
                  product_details_hash: file.cid.string,
                  product_id: pid.toString(),
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
              validateForm,
            }) => (
              <Form onSubmit={handleSubmit}>
                {errorThrow && <p>{errorThrow}</p>}
                <div className="form-group">
                  <label htmlFor="headline">Title</label>
                  {touched.headline && errors.headline && (
                    <p className="alert alert-danger">{errors.headline}</p>
                  )}

                  <Field name="headline" className="form-control" />
                </div>

                <label htmlFor="audience">Blog Image</label>
                {errors.productimage && touched.productimage && (
                  <p className="alert alert-danger">{errors.productimage}</p>
                )}
                <DropProductImageUpdate
                  name={"productimage"}
                  setFieldValue={setFieldValue}
                  setFieldTouched={setFieldTouched}
                  oldimage={ipfsData.productimage}
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
                  <label htmlFor="PDFs">Videos</label>
                  {touched.video && errors.video && (
                    <p className="alert alert-danger">{errors.video}</p>
                  )}
                  <DropProductPDFsUpdate
                    name={"video"}
                    setFieldValue={setFieldValue}
                    ipfsoldpaths={ipfsData.video}
                  />
                </div>


                <div className="form-group">
                  <label htmlFor="specialization">specialization</label>
                  {touched.specialization && errors.specialization && (
                    <p className="alert alert-danger">
                      {errors.specialization}
                    </p>
                  )}
                  <TagsInput
                    selectedTags={selectedTags}
                    name={"specialization"}
                    setFieldValue={setFieldValue}
                    tags={ipfsData.specialization.split(",")}
                  />
                  {/* <TagsInput name="specialization" value={values.specialization} onChange={specialization => {
                  console.log(specialization)
                  setFieldValue("specialization", specialization)
                }} /> */}
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    Submit Form
                  </button>
                </div>
                <SubmittingWheel isSubmitting={isSubmitting} />
                <FocusError />
              </Form>
            )}
          </Formik>
        </div>
      </React.Fragment>
    )
  } else if (fetchProductError) {
      return (
          <React.Fragment>
              {JSON.stringify(fetchProductError.message)}
          </React.Fragment>
      )
  } else {
    return (
      <React.Fragment>
        <div className="container">
          <div className="d-flex justify-content-center">
            <div className="spinner-grow text-warning" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default UpdateProduct
