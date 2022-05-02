import React from 'react';

import transform from 'lodash/transform';

import Alert from 'react-bootstrap/Alert';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Stack from 'react-bootstrap/Stack';
import Spinner from 'react-bootstrap/Spinner';

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
      updateFormOnId: null,

      fastUpdateWeight: null,
      fastUpdateWeightId: null,

      form: {
        title: null,
        weight: null,
      },

      isReady: false,
    };

    this.handleCreateObjective = this.handleCreateObjective.bind(this);
    this.handleUpdateObjective = this.handleUpdateObjective.bind(this);
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

  async handleUpdateObjective() {
    const {
      form, updateFormOnId, fastUpdateWeightId, fastUpdateWeight,
    } = this.state;
    const id = fastUpdateWeightId || updateFormOnId;
    const weight = fastUpdateWeight || form.weight;

    const updateObjectivesUrl = `api/v1/objectives/${id}`;
    const response = await fetch(updateObjectivesUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        objective: {
          ...form,
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

    if (fieldName === 'fastUpdateWeight') {
      this.setState({ fastUpdateWeight: fieldVal });
    } else {
      this.setState({ form: { ...form, [fieldName]: fieldVal } });
    }
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
      updateFormOnId: null,
      fastUpdateWeightId: null,
      fastUpdateWeight: null,
    });
    this.loadData();
  }

  handleKeyDown(event) {
    const { fastUpdateWeightId, updateFormOnId } = this.state;
    if (event.key === 'Enter') {
      if (fastUpdateWeightId || updateFormOnId) {
        this.handleUpdateObjective();
      } else {
        this.handleCreateObjective();
      }
    }
  }

  render() {
    const {
      objectives,
      overviews,
      errors,
      isReady,
      isCreateFormOn,
      updateFormOnId,
    } = this.state;

    const renderObjectiveLine = (objective) => {
      if (updateFormOnId === objective.id) {
        return (
          <>
            <Form.Control
              name="title"
              defaultValue={this.state.form.title}
              onChange={this.handleFormChange.bind(this)}
              onKeyDown={this.handleKeyDown.bind(this)}
            />
            <Form.Control
              name="weight"
              defaultValue={this.state.form.weight}
              onChange={this.handleFormChange.bind(this)}
              onKeyDown={this.handleKeyDown.bind(this)}
            />
            <Button
              variant="secondary"
              onClick={this.handleUpdateObjective}
            >
              Update
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                this.setState({ updateFormOnId: null });
              }}
            >
              Cancel
            </Button>
          </>
        );
      }
      return (
        <>
          <span
            onClick={() => {
              this.setState((prevState) => ({
                updateFormOnId: objective.id,
                form: {
                  ...prevState.form,
                  title: objective.attributes.title,
                  weight: objective.attributes.weight,
                },
              }));
            }}
          >
            {objective.attributes.title}
          </span>
          {objective.attributes.weight ? (
            <Badge
              bg="secondary"
              text="light"
              onClick={() => {
                this.setState((prevState) => ({
                  updateFormOnId: objective.id,
                  fastUpdateWeightId: null,
                  form: {
                    ...prevState.form,
                    title: objective.attributes.title,
                    weight: objective.attributes.weight,
                  },
                }));
              }}
            >
              {objective.attributes.weight}
              {' '}
              %
            </Badge>
          ) : (
            <Form.Control
              name="fastUpdateWeight"
              defaultValue={this.state.fastUpdateWeight}
              onChange={this.handleFormChange.bind(this)}
              size="sm"
              style={{ width: '10%' }}
              onClick={() => {
                this.setState((prevState) => ({
                  fastUpdateWeightId: objective.id,
                  form: {
                    ...prevState.form,
                    title: objective.attributes.title,
                  },
                }));
              }}
              onKeyDown={this.handleKeyDown.bind(this)}
            />
          )}
          <Trash id="delete" onClick={() => this.deleteObjective(objective.id)} />
        </>
      );
    };

    if (!isReady) {
      return (
        <Spinner animation="border" />
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
          <Alert variant="primary" id="empty-list">
            No objective yet :(
          </Alert>
          )}
          <ListGroup>
            {isCreateFormOn && (
            <ListGroup.Item
              key="new"
              id="new-objective-form"
              className="d-flex justify-content-between"
            >
              <Form.Control
                name="title"
                placeholder="Add your title here..."
                onKeyDown={this.handleKeyDown.bind(this)}
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
                id="objective-line"
                className="d-flex justify-content-between align-items-start"
              >
                {renderObjectiveLine(objective)}
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
