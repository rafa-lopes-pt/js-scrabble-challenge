import { Card, Col, Flex, Grid, Input, Radio, Row, Select, Slider } from 'antd'
import React from 'react'

export default function ConfigGame({ onGameStart }: { onGameStart: Function }) {
  return (
    <>
      <Row>
        <h1>Config Game</h1>
      </Row>

      <Row>
        <Col>
          <Card>
            <h2>Player List</h2>
          </Card>
        </Col>

        <Col>
          <Card>
            <h2>Game Settings</h2>

            <TimeInput></TimeInput>
            <LanguageInput />
          </Card>
        </Col>
      </Row>
    </>
  )
}

//FIX: Select value should be Date?
function TimeInput() {
  return (
    <Flex gap={'middle'} align="center">
      <label>Game Length</label>
      <Select
        placeholder="Select mode..."
        options={[
          { value: 'L', label: 'Long (2h)' },
          { value: 'M', label: 'Medium (1h)' },
          { value: 'S', label: 'Short (30min)' }
        ]}
      />
    </Flex>
  )
}
function LanguageInput() {
  const options = [
    { label: 'English', value: 'EN' },
    { label: 'Portuguese', value: 'PT', disabled: true }
  ]

  return <Radio.Group options={options} optionType="button" />
}
