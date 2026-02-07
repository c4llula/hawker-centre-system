document.addEventListener('DOMContentLoaded', function() {
    const fields = document.querySelectorAll('.field');
    const stallNumberField = fields[0];
    const startDateField = fields[1];
    const endDateField = fields[2];
    const rentalFeeField = fields[3];
    const discardButton = document.querySelector('.discard');
    const renewButton = document.querySelector('.renew');
    const sidebarItems = document.querySelectorAll('.sidebar ul li');
    const topBarButtons = document.querySelectorAll('.top-bar button');

    function makeEditable(element, placeholder) {
        element.addEventListener('click', function() {
            if (element.textContent === placeholder || element.textContent.includes('Enter')) {
                element.textContent = '';
            }
            element.contentEditable = true;
            element.focus();
        });

        element.addEventListener('blur', function() {
            element.contentEditable = false;
            if (element.textContent.trim() === '') {
                element.textContent = placeholder;
            }
        });

        element.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                element.blur();
            }
        });
    }

    makeEditable(stallNumberField, 'Enter stall number...');
    
    function formatDate(value) {
        const numbers = value.replace(/[^0-9]/g, '');
        let formatted = '';
        
        if (numbers.length > 0) {
            formatted = numbers.substring(0, 2);
        }
        if (numbers.length > 2) {
            formatted += '/' + numbers.substring(2, 4);
        }
        if (numbers.length > 4) {
            formatted += '/' + numbers.substring(4, 8);
        }
        
        return formatted;
    }

    function setupDateField(field, placeholder) {
        field.addEventListener('click', function() {
            if (field.textContent === placeholder) {
                field.textContent = '';
            }
            field.contentEditable = true;
            field.focus();
        });

        field.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                field.blur();
                return;
            }
            
            if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
                return;
            }
            
            const currentText = field.textContent.replace(/[^0-9]/g, '');
            if (currentText.length >= 8) {
                e.preventDefault();
            }
        });

        field.addEventListener('input', function(e) {
            const formatted = formatDate(field.textContent);
            const cursorWasAtEnd = window.getSelection().getRangeAt(0).startOffset >= field.textContent.length;
            
            field.textContent = formatted;
            
            if (cursorWasAtEnd) {
                placeCaretAtEnd(field);
            }
        });

        field.addEventListener('blur', function() {
            field.contentEditable = false;
            const numbers = field.textContent.replace(/[^0-9]/g, '');
            if (numbers.length < 8) {
                field.textContent = placeholder;
            }
        });
    }

    setupDateField(startDateField, 'Enter rental start date...');
    setupDateField(endDateField, 'Enter rental end date...');
    
    rentalFeeField.addEventListener('click', function() {
        rentalFeeField.contentEditable = true;
        rentalFeeField.focus();
        if (rentalFeeField.textContent === 'Enter price...') {
            rentalFeeField.textContent = '$';
            placeCaretAtEnd(rentalFeeField);
        }
    });

    rentalFeeField.addEventListener('blur', function() {
        rentalFeeField.contentEditable = false;
        if (rentalFeeField.textContent === '$' || rentalFeeField.textContent.trim() === '') {
            rentalFeeField.textContent = 'Enter price...';
        }
    });

    rentalFeeField.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            rentalFeeField.blur();
            return;
        }
        
        if (!/[0-9]/.test(e.key)) {
            e.preventDefault();
        }
    });

    rentalFeeField.addEventListener('input', function() {
        let value = rentalFeeField.textContent.replace(/[^0-9]/g, '');
        
        if (value) {
            rentalFeeField.textContent = '$' + value;
            placeCaretAtEnd(rentalFeeField);
        } else if (rentalFeeField.textContent !== '$') {
            rentalFeeField.textContent = '$';
            placeCaretAtEnd(rentalFeeField);
        }
    });

    rentalFeeField.addEventListener('keydown', function(e) {
        if (e.key === 'Backspace' && rentalFeeField.textContent === '$') {
            e.preventDefault();
        }
    });

    discardButton.addEventListener('click', function() {
        const confirmDiscard = confirm('Are you sure you want to discard all changes?');
        if (confirmDiscard) {
            stallNumberField.textContent = 'Enter stall number...';
            startDateField.textContent = 'Enter rental start date...';
            endDateField.textContent = 'Enter rental end date...';
            rentalFeeField.textContent = 'Enter price...';
        }
    });

    renewButton.addEventListener('click', function() {
        const stallNumber = stallNumberField.textContent;
        const startDate = startDateField.textContent;
        const endDate = endDateField.textContent;
        const rentalFee = rentalFeeField.textContent;

        if (stallNumber.includes('Enter') || startDate.includes('Enter') || endDate.includes('Enter') || rentalFee.includes('Enter')) {
            alert('Please fill in all required fields before submitting.');
            return;
        }

        const confirmRenewal = confirm(
            `Confirm Rental Renewal:\n\n` +
            `Stall Number: ${stallNumber}\n` +
            `Period: ${startDate} to ${endDate}\n` +
            `Monthly Fee: ${rentalFee}\n\n` +
            `Do you want to proceed?`
        );

        if (confirmRenewal) {
            alert('Rental agreement renewed successfully!');
            stallNumberField.textContent = 'Enter stall number...';
            startDateField.textContent = 'Enter rental start date...';
            endDateField.textContent = 'Enter rental end date...';
            rentalFeeField.textContent = 'Enter price...';
        }
    });

    sidebarItems.forEach(item => {
        item.addEventListener('click', function() {
            sidebarItems.forEach(i => i.style.backgroundColor = 'transparent');
            item.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            item.style.borderRadius = '5px';
        });
    });

    topBarButtons.forEach(button => {
        button.addEventListener('click', function() {
            topBarButtons.forEach(btn => {
                btn.style.backgroundColor = '';
            });
            button.style.backgroundColor = '#5a7a8a';
        });
    });

    fields.forEach(field => {
        field.addEventListener('focus', function() {
            field.style.borderColor = '#52ad9c';
            field.style.backgroundColor = '#ffffff';
        });

        field.addEventListener('blur', function() {
            field.style.borderColor = 'lightgrey';
            field.style.backgroundColor = '#fafafa';
        });
    });

    function placeCaretAtEnd(el) {
        el.focus();
        if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
            const range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }
});