import React from 'react';
import {ArrowRotateRight} from '@gravity-ui/icons';
import {Button, ButtonIcon, Disclosure} from '@gravity-ui/uikit';

const result = <>
    <Button.Icon side="start" someProp="123">
        <ArrowRotateRight />
    </Button.Icon>
    <ButtonIcon side="start" />
    <Disclosure side="start" />
    <Button.Something side="left" someProp="123">
        <ArrowRotateRight />
    </Button.Something>
</>
