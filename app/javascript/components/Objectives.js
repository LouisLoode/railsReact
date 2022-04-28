import React from 'react';

import transform from 'lodash/transform';

import Alert from 'react-bootstrap/Alert';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Stack from 'react-bootstrap/Stack';

const VALIDATIONS_MESSAGES = {
  weight_undefined: 'Weights are missing on some objective(s)',
  sum_not_equal_to_hundred: 'You have some invalid weights !',
};

class Objectives extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      objectives: [],
      overviews: [],

      errors: [],
      isCreateFormOn: false,

      form: {
        title: null,
        weight: null,
      },

      isReady: false,
    };

    this.handleCreateObjective = this.handleCreateObjective.bind(this);
    this.handleOpenCreateForm = this.handleOpenCreateForm.bind(this);
  }

  componentDidMount() {
    this.loadOverviews();
    this.loadObjectives();
  }

  async handleCreateObjective() {
    const createObjectivesUrl = 'api/v1/objectives';
    const { form } = this.state;
    const { title, weight } = form;

    const payload = JSON.stringify({
      objective: {
        title,
        weight,
      },
    });

    const response = await fetch(createObjectivesUrl, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: payload,
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData) {
        const errorsTransformed = transform(errorData, (result, value, key) => {
          value.forEach((error) => {
            result.push(`${key} ${error}`);
          });
        }, []);

        this.setState({ errors: errorsTransformed });
      }
    } else if (response.ok) {
      const jsonData = await response.json();
      if (jsonData) {
        this.reloadObjectives();
      }
    }
  }

  handleOpenCreateForm() {
    this.setState((state) => ({
      isCreateFormOn: !state.isCreateFormOn,
    }));
  }

  handleFormChange(event) {
    const fieldName = event.target.name;
    const fieldVal = event.target.value;
    const { form } = this.state;

    this.setState({ form: { ...form, [fieldName]: fieldVal } });
  }

  async loadObjectives() {
    const objectivesUrl = 'api/v1/objectives';

    const response = await fetch(objectivesUrl);
    if (response.ok) {
      const jsonData = await response.json();
      if (jsonData) {
        this.setState(() => ({
          objectives: jsonData.data,
          isReady: true,
        }));
      }
    }
  }

  async loadOverviews() {
    const overviewsUrl = 'api/v1/overviews';

    const response = await fetch(overviewsUrl);
    if (response.ok) {
      const jsonData = await response.json();
      if (jsonData) {
        this.setState(() => ({
          overviews: jsonData,
        }));
      }
    }
  }

  reloadObjectives() {
    this.setState({
      objectives: [],
      overviews: [],
      form: {
        title: null,
        weight: null,
      },
      errors: [],
      isReady: false,
    });
    this.loadOverviews();
    this.loadObjectives();
  }

  render() {
    const {
      objectives, overviews, isReady, isCreateFormOn, errors,
    } = this.state;

    if (!isReady) {
      return (
        <b>Data loading</b>
      );
    }
    return (
      <>
        <Button
          variant="secondary"
          onClick={this.handleOpenCreateForm}
        >
          {!isCreateFormOn ? '+ Add obj.' : 'Cancel'}
        </Button>

        <Stack className="col-lg-8 mx-auto">
          {errors.length > 0 && (
          <Alert variant="danger">
            <ul>
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </Alert>
          )}
          {objectives.length === 0 && !isCreateFormOn && (
          <Alert variant="primary">
            No objective yet :(
          </Alert>
          )}
          <ListGroup>
            {isCreateFormOn && (
            <ListGroup.Item
              key="new"
              className="d-flex justify-content-between align-items-start"
            >
              <Form.Control
                className="me-auto"
                name="title"
                placeholder="Add your title here..."
                onChange={this.handleFormChange.bind(this)}
              />
              <Form.Control
                className="me-auto"
                name="weight"
                placeholder="Add your weight here..."
                onChange={this.handleFormChange.bind(this)}
              />
              <Button
                variant="secondary"
                onClick={this.handleCreateObjective}
              >
                Create
              </Button>
            </ListGroup.Item>
            )}

            {objectives.map((objective) => (
              <ListGroup.Item
                key={objective.id}
                className="d-flex justify-content-between align-items-start"
              >
                <div className="sm-2 me-auto">
                  <div className="fw-bold">{objective.attributes.title}</div>
                </div>
                <Badge bg="secondary" text="light">
                  {objective.attributes.weight}
                  {' '}
                  %
                </Badge>
              </ListGroup.Item>
            ))}
          </ListGroup>

          {overviews && overviews.length > 0 && (
          <Alert variant="warning">
            <ul>
              {overviews.map((overview) => (
                <li key={overview}>{VALIDATIONS_MESSAGES[overview]}</li>
              ))}
            </ul>
          </Alert>
          )}
        </Stack>
      </>
    );
  }
}

export default Objectives;
