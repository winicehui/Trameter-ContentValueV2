const styles = {
    root: {
        fontSize: '16px',
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                border: '1px solid #707070',
                color: '#353B51'
            },
            '&:hover fieldset': {
                border: '1.5px solid #707070',
            },
            '&.Mui-focused fieldset': {
                border: '2px solid #707070',
                color: '#353B51'
            },
        }
    },
    resize: {
        fontSize: '16px'
    },
    button: {
        border: '1px solid #707070',
        color: '#353B51',
        height: '40px',
        '&:active': {
            border: '2px solid #707070',
            backgroundColor: '#F2F3F4'
        },
        '&:hover': {
            border: '1.5px solid #707070',
            backgroundColor: '#F2F3F4'
        },
    }
}

export default styles;