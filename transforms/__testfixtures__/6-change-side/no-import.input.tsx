import React from 'react';
import {ArrowRotateRight} from '@gravity-ui/icons';

function Disclosure() {}
function ButtonIcon() {}
const Button = {
    Icon: function() {}
}

const result = <>
    <Button.Icon side="left" someProp="123">
        <ArrowRotateRight />
    </Button.Icon>
    <ButtonIcon side="left" />
    <Disclosure side="left" />
</>
