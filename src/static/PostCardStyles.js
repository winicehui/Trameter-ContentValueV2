const styles = {
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
    },
    iconButton: {
        cursor: 'pointer',
        margin: '0px',
        float: 'right',
        padding: '0px',
        color: '#707070',
        '&:active': {
            color: '#353B51'
        },
        '&:hover': {
            color: '#353B51'
        },
    },
    canChoose_disabled: {
        cursor: 'pointer',
        "&:disabled": {
            color: "#707070"
        }
    },
    cantChoose_disabled: {
        cursor: 'auto',
        "&:disabled": {
            color: "#707070"
        }
    }
}

export default styles;