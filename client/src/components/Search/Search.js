import React, { Component } from 'react';
import API from '../../utils/API';
import "./Search.css";

class Search extends Component {
  state = {
    City: '',
    State: '',
    propertiesList: []
  };

  searchZillowProperties = (city, state) => {
    API.searchZillowProperties(city, state)
      .then(res => {
          console.log("Zillow API Call: ",res.data);
          
        // take res.data.items array and create new array with less information
        const propertiesList = res.data.map(property => {
          return {
                property
        //     propertyId: property.id,
        //     authors: property.volumeInfo.authors,
        //     title: property.volumeInfo.title,
        //     date: property.volumeInfo.publishedDate,
        //     description: property.volumeInfo.description,
        //     image: property.volumeInfo.imageLinks ? property.volumeInfo.imageLinks.thumbnail : 'https://fillmurray.com/200/300',
        //     link: property.volumeInfo.infoLink
          };
        });
        // set state to have new property list
        this.setState({ propertiesList });
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleInputChange = event => {
    const { name, value } = event.target;

    this.setState({
      [name]: value
    });
  };

  handleFormSubmit = event => {
    event.preventDefault();
    if (!this.state.searchTerm) {
      return false;
    }

    this.searchZillowProperties(this.state.City, this.state.State);
  };

  saveproperty = propertyId => {
    // find property in this.state.propertiesList based on the propertyId value
    const propertyPicked = this.state.propertiesList.find(property => property.propertyId === propertyId);
    console.log(propertyPicked);
    API.saveproperty(propertyPicked)
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    return (
      <React.Fragment>
        {/* make jumbotron */}
        {/* create row with two columns */}
        <div id="searchDiv" className="container-fluid">
          <div className="row">
              <h2 id="title">Search for properties</h2>
          </div>
          <div className="row">
            {/* form section */}
            <div className="col-12 col-sm-6 col-md-8">
              <form onSubmit={this.handleFormSubmit}>
                <input
                    name="City"
                    onChange={this.handleInputChange}
                    placeholder="City"
                    value={this.state.City}
                    type="input"
                    className="form-control mb-3"
                />
                <input
                    name="State"
                    onChange={this.handleInputChange}
                    placeholder="State"
                    value={this.state.State}
                    type="input"
                    className="form-control mb-3"
                />
                <button className="btn btn-block btn-success" onClick={this.handleFormSubmit}>
                  Search for property.
                </button>
              </form>
            </div>
          </div>
          <div className="row">
            {/* end form section */}
            {/* begin property result section */}
            <div className="col-12 col-sm-6 col-md-9">
              {this.state.propertiesList.length ? (
                <React.Fragment>
                  <h3>Search Results for: {this.state.City}, {this.state.State}</h3>
                  <div className="row">
                    {this.state.propertiesList.map(property => {
                      return (
                        <div className="col-12 col-md-6" key={property.propertyId}>
                          <div className="card">
                            <img src={property.image} alt={property.title} className="card-img-top" />
                            <div className="card-body">
                              <h5 className="card-title">{property.title}</h5>
                              <p className="card-text">Released: {property.date}</p>
                              {property.authors ? <p className="card-text">By: {property.authors.join(', ')}</p> : ''}
                              <p className="card-text">
                                <strong>Description</strong>: {property.description}{' '}
                              </p>

                              <a
                                href={property.link}
                                rel="noopener noreferrer"
                                target="_blank"
                                className="btn btn-success btn-small">
                                See More.
                              </a>
                              <button onClick={() => this.saveproperty(property.propertyId)} className="btn btn-dark btn-small">
                                Save property.
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </React.Fragment>
              ) : ""}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Search;
