import React from 'react';
import {ArrowRotateRight} from '@gravity-ui/icons';

function Disclosure() {
}

const Button = {
    Icon: function () {
    },
    Something: function () {
    }
}

const result = <>
    <Button.Icon side="left" someProp="123">
        <ArrowRotateRight/>
    </Button.Icon>
    <Disclosure side="left"/>
    <Button.Something side="left" someProp="123">
        <ArrowRotateRight/>
    </Button.Something>
</>
