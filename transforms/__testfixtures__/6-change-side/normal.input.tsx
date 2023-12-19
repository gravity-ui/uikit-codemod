import React from 'react';
import {ArrowRotateRight} from '@gravity-ui/icons';
import {Button, ButtonIcon, Disclosure} from '@gravity-ui/uikit';

const result = <>
    <Button.Icon side="left" someProp="123">
        <ArrowRotateRight />
    </Button.Icon>
    <ButtonIcon side="left" />
    <Disclosure side="left" />
    <Button.Something side="left" someProp="123">
        <ArrowRotateRight />
    </Button.Something>
</>
