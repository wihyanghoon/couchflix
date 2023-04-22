import React from 'react'
import styled from 'styled-components'

const Loading = () => {
  return (
    <Wrap>
        <h1>
          <img src={`${process.env.PUBLIC_URL}/logo1.png`} alt="" />
        </h1>
    </Wrap>
  )
}

const Wrap = styled.div`
    width: 100%;
    min-height: 100vh;
    background-color: #fff;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
`

export default Loading