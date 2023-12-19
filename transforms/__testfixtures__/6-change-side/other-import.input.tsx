import React from 'react';
import {ArrowRotateRight} from '@gravity-ui/icons';
import {Button, ButtonIcon, Disclosure} from 'random-package';

const result = <>
    <Button.Icon side="left" someProp="123">
        <ArrowRotateRight />
    </Button.Icon>
    <ButtonIcon side="start" />
    <Disclosure side="start" />
    <Button.Something side="left" someProp="123">
        <ArrowRotateRight />
    </Button.Something>
</>

