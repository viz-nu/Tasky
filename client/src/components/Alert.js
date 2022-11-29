function Alert({ alert }) {
    return <>
        {alert !== null && (
            <h4 className={`alert-${alert.type}`}> {alert.msg}</h4>
        )}
    </>
}

export default Alert;
