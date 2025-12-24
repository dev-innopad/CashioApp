import * as Yup from 'yup';

// validators
const validators = {

	validateName: Yup.string().required('Full name is required'),

	validateMobileNumber: Yup.string()
		.matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits')
		.required('Mobile number is required'),

	validateEmail: Yup.string()
		.email('Invalid email address')
		.required('Email is required'),

	validatePassword: Yup.string()
		.min(6, 'Password must be at least 6 characters')
		.required('Password is required'),

	validateConfirmPassword: Yup.string()
		.oneOf([Yup.ref('password')], 'Passwords must match')
		.required('Confirm password is required'),

}

// Validation schema with Yup
export const loginValidationSchema = Yup.object().shape({
	email: validators.validateEmail,
	password: validators.validatePassword,
});

export const registerValidationSchema = Yup.object().shape({
	name: validators.validateName,
	email: validators.validateEmail,
	mobileNumber: validators.validateMobileNumber,
	password: validators.validatePassword,
	confirmPassword: validators.validateConfirmPassword
});