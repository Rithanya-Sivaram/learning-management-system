import React, { useState } from 'react'
import classes from "./Auth.module.css";
import { Box, TextField, Typography,Button } from '@mui/material';



/**
 * A functional component that renders a password setup card.
 * It allows users to input and confirm their new password during the password setup process.
 * The component is integrated with Formik for form handling and validation.
 *
 * @param {Object} formik - The Formik object used to manage form state and validation.
 * @returns {JSX.Element} The JSX representation of the password setup card.
 */

const PasswordSetupCard = ({formik}) => {

  return (
    <Box>
    <Box style={{ marginTop: "4px" }}>
      <Typography>
        Password <span style={{ color: "red" }}>*</span>
      </Typography>
      <TextField
        InputProps={{
          style: {
            height: 40,
          },
        }}
        name="password"
        onChange={formik.handleChange}
        value={formik?.values.password}
        type="password"
        className={classes.field}
      />
      {formik.errors?.password && (
        <Typography className={classes.error}>
          {formik.errors?.password}
        </Typography>
      )}
    </Box>
    <Box style={{ marginTop: "4px" }}>
      <Typography>
        Confirm Password <span style={{ color: "red" }}>*</span>
      </Typography>
      <TextField
        InputProps={{
          style: {
            height: 40,
          },
        }}
        name="confirmPassword"
        onChange={formik.handleChange}
        value={formik?.values.confirmPassword}
        type="password"
        className={classes.field}
      />
      {formik.errors?.confirmPassword && (
        <Typography className={classes.error}>
          {formik.errors?.confirmPassword}
        </Typography>
      )}
    </Box>
    <Box
      style={{ marginTop: "12px" }}
      className={classes.fielContinaer}>
      <Button type="submit" className={classes.submitBtn}>
        Submit
      </Button>
    </Box>
    </Box>
  )
}

export default PasswordSetupCard