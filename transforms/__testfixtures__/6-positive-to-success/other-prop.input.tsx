import React from "react";
import {Alert, Card} from "@gravity-ui/uikit";

const result = <>
    <Alert className="some-class" onClick={closeAlert} />
    <Alert onClick={closeAlert} />
    <Alert className="some-class" />
    <Alert disabled={true} />
    <Alert positive={true} />
    <Alert positive />
    <Card className="some-class" onClick={closeAlert} />
    <Card onClick={closeAlert} />
    <Card className="some-class" />
    <Card disabled={true} />
    <Card positive={true} />
    <Card positive />
</>;

