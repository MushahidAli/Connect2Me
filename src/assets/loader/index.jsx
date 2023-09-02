import React from 'react'
import { Spinner } from 'react-bootstrap'

export default function index() {
    return (
        <>
            <Spinner animation="grow" variant="secondary" size="sm" />&nbsp;<Spinner animation="grow" variant="secondary" size="sm" />&nbsp;<Spinner animation="grow" variant="secondary" size="sm" />
        </>
    );
}