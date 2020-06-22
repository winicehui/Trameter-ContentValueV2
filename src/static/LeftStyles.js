const styles = {
    root: {
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