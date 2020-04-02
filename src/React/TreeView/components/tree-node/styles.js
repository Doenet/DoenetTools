import styled, { createGlobalStyle } from 'styled-components'
import { animated } from 'react-spring'

const Global = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
  html,
  body,
  #root {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    background: #191b21;
    overflow: hidden;
    font-family: 'Monospaced Number', 'Chinese Quote', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 14px;
    line-height: 21px;
  }
  html,
  body,
  div,
  a,
  i,
  button,
  select,
  option,
  optgroup,
  hr,
  br {
    user-select: none;
    cursor: default;
  }
  #root {
    padding: 30px;
  }
`

const Frame = styled('div')`
  display: inline-block;
  position: relative;
  padding: 4px 15px 0px 0px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow-x: hidden;
  overflow-y: hidden;
  vertical-align: middle;
  color: white;
  fill: white;
  background: ${props => props.draggedOver ? "rgba(255, 255, 255, 0.3)" : "none" };
`

const Title = styled('span')`
  vertical-align: middle;
`

const Content = styled(animated.div)`
  will-change: transform, opacity, height;
  margin-left: 6px;
  padding: 0px 0px 0px 14px;
  border-left: 1px dashed ${ props => props.draggedover == "false" ? "rgba(255, 255, 255, 0.4)" : "#37ceff" };
  
`

const toggle = {
  width: '1em',
  height: '1em',
  marginRight: 10,
  cursor: 'pointer',
  verticalAlign: 'middle'
}

export { Global, Frame, Content, toggle, Title }
