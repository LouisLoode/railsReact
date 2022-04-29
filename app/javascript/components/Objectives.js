import React from 'react';

import transform from 'lodash/transform';

import Alert from 'react-bootstrap/Alert';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Stack from 'react-bootstrap/Stack';

import { Trash } from 'react-bootstrap-icons';

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
    this.loadData();
  }

  async handleCreateObjective() {
    const createObjectivesUrl = 'api/v1/objectives';
    const { form } = this.state;
    const { title, weight } = form;

    const response = await fetch(createObjectivesUrl, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        objective: {
          title,
          weight,
        },
      }),
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
        this.refreshData();
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

  async deleteObjective(id) {
    const objectiveUrl = `api/v1/objectives/${id}`;

    const response = await fetch(objectiveUrl, {
      method: 'delete',
    });

    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }

    this.refreshData();
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

  loadData() {
    this.loadOverviews();
    this.loadObjectives();
  }

  refreshData() {
    this.setState({
      objectives: [],
      overviews: [],
      form: {
        title: null,
        weight: null,
      },
      errors: [],
      isCreateFormOn: false,
      isReady: false,
    });
    this.loadData();
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
              className="d-flex justify-content-between"
            >
              <Form.Control
                name="title"
                placeholder="Add your title here..."
                onChange={this.handleFormChange.bind(this)}
              />
              <Form.Control
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
                <div>
                  <div className="fw-bold">{objective.attributes.title}</div>
                </div>
                {objective.attributes.weight && (
                  <Badge bg="secondary" text="light">
                    {objective.attributes.weight}
                    {' '}
                    %
                  </Badge>
                )}
                <Trash onClick={() => this.deleteObjective(objective.id)} />
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
