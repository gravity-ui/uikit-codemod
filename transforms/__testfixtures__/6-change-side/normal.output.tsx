import React from 'react';
import {ArrowRotateRight} from '@gravity-ui/icons';
import {Button, Disclosure} from '@gravity-ui/uikit';

const result = <>
    <Button.Icon side="start" someProp="123">
        <ArrowRotateRight/>
    </Button.Icon>
    <Disclosure side="start"/>
    <Button.Something side="left" someProp="123">
        <ArrowRotateRight/>
    </Button.Something>
</>
