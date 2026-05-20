const Validation = {
    rules: {
        required: function(value) {
            return value !== null && value !== undefined && value.toString().trim() !== '';
        },
        email: function(value) {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(value);
        },
        phone: function(value) {
            const regex = /^(\+51)?[ ]?\d{9}$/;
            return regex.test(value.replace(/\s/g, ''));
        },
        minLength: function(value, min) {
            return value && value.length >= min;
        },
        maxLength: function(value, max) {
            return value && value.length <= max;
        },
        exactLength: function(value, length) {
            return value && value.length === length;
        },
        number: function(value) {
            return !isNaN(parseFloat(value)) && isFinite(value);
        },
        integer: function(value) {
            return Number.isInteger(Number(value));
        },
        positive: function(value) {
            return Number(value) > 0;
        },
        url: function(value) {
            try {
                new URL(value);
                return true;
            } catch {
                return false;
            }
        },
        dni: function(value) {
            return /^\d{8}$/.test(value);
        },
        ruc: function(value) {
            return /^\d{11}$/.test(value);
        }
    },

    validate: function(data, rules) {
        const errors = {};
        let isValid = true;

        for (const field in rules) {
            const fieldRules = rules[field];
            const value = data[field];

            for (const rule in fieldRules) {
                let result = false;
                const params = fieldRules[rule];

                switch (rule) {
                    case 'required':
                        result = this.rules.required(value);
                        break;
                    case 'email':
                        result = value ? this.rules.email(value) : true;
                        break;
                    case 'phone':
                        result = value ? this.rules.phone(value) : true;
                        break;
                    case 'minLength':
                        result = value ? this.rules.minLength(value, params) : true;
                        break;
                    case 'maxLength':
                        result = value ? this.rules.maxLength(value, params) : true;
                        break;
                    case 'exactLength':
                        result = value ? this.rules.exactLength(value, params) : true;
                        break;
                    case 'number':
                        result = value ? this.rules.number(value) : true;
                        break;
                    case 'integer':
                        result = value ? this.rules.integer(value) : true;
                        break;
                    case 'positive':
                        result = value ? this.rules.positive(value) : true;
                        break;
                    case 'url':
                        result = value ? this.rules.url(value) : true;
                        break;
                    case 'dni':
                        result = value ? this.rules.dni(value) : true;
                        break;
                    case 'ruc':
                        result = value ? this.rules.ruc(value) : true;
                        break;
                    case 'custom':
                        result = params(value, data);
                        break;
                }

                if (!result) {
                    errors[field] = fieldRules.message || `El campo ${field} es inválido`;
                    isValid = false;
                    break;
                }
            }
        }

        return { isValid, errors };
    },

    showError: function(input, message) {
        const formGroup = input.closest('.form-group') || input.parentElement;
        let errorElement = formGroup.querySelector('.form-error');

        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'form-error';
            input.after(errorElement);
        }

        input.classList.add('error');
        errorElement.textContent = message;
    },

    clearError: function(input) {
        const formGroup = input.closest('.form-group') || input.parentElement;
        const errorElement = formGroup.querySelector('.form-error');

        input.classList.remove('error');
        if (errorElement) {
            errorElement.remove();
        }
    },

    clearAllErrors: function(form) {
        const inputs = form.querySelectorAll('.form-input, .form-select, .form-textarea');
        inputs.forEach(input => this.clearError(input));
    }
};

window.Validation = Validation;