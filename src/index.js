import React from 'react';
import { render } from 'react-dom';
import App from './app';
import {appendBody} from './util';

render(<App />, appendBody());