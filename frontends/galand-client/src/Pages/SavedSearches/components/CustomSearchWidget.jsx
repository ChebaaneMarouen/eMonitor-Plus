import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { CustomSearch, Projects } from "modules/ressources";

class CustomSearchWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeSelect: "",
        };
        this.onChange = this.onChange.bind(this);
        this.removeCustomSearch = this.removeCustomSearch.bind(this);
    }
    componentDidMount() {
        const { getCustomSearches } = this.props;
        getCustomSearches();
    }
    onChange(value) {
        const { searchChanged, initialSearch } = this.props;
        console.log(value);
        // reset search configurations
        if (value === "reset") return searchChanged(initialSearch);

        searchChanged(value.search);
        this.setState({
            activeSelect: value,
        });
    }
    removeCustomSearch() {
        const { activeSelect } = this.state;
        const { removeCustomSearch } = this.props;
        if (activeSelect) {
            removeCustomSearch({ _id: activeSelect });
            this.setState({
                activeSelect: "",
            });
        }
    }

    getCustomSearchesFromProjects(projects) {
        return projects
            .map((p) => ({
                name: "Project: " + p.title,
                isProject: true,
                search: {
                    filter: {
                        multi_media: p.media,
                        after_created: p.startProject,
                        before_created: p.endProject,
                    },
                },
            }))
            .map((p) => ({ label: p.name, value: p }));
    }

    render() {
        const { t, customSearches, projects, searchType, selecProjectCustSearchesIds } = this.props;

        const searches = Array.isArray(selecProjectCustSearchesIds)
            ? customSearches
                  .filter((cs) =>
                      searchType === "NEWS"
                          ? cs.searchType === "NEWS"
                          : cs.searchType === searchType && selecProjectCustSearchesIds.includes(cs._id)
                  )
                  .map((cs) => ({ label: cs.name, value: cs }))
            : customSearches
                  .filter((cs) => cs.searchType === searchType)
                  .map((cs) => ({ label: cs.name, value: cs }));

        // if search Type is news do not render projects
        const projectSearches =
            searchType === "NEWS" ? [] : this.getCustomSearchesFromProjects(projects);

        return (
            <li className="dropdown">
                <a className="dropdown-toggle" data-toggle="dropdown" aria-expanded="true" href="#">
                    {t("TITLE_PREDEFINED_SEARCH")} <span className="caret" />
                </a>
                <ul className="dropdown-menu">
                    {searches.map((option, i) => (
                        <li role="presentation" key={i}>
                            <a role="menuitem" href="#" onClick={() => this.onChange(option.value)}>
                                {option.label}
                            </a>
                        </li>
                    ))}
                    <li
                        role="presentation"
                        className="divider"
                        hidden={!projectSearches.length || !searches.length}
                    />
                    {projectSearches.map((option, i) => (
                        <li role="presentation" key={i}>
                            <a role="menuitem" href="#" onClick={() => this.onChange(option.value)}>
                                {option.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </li>
        );
    }
}

CustomSearchWidget.propTypes = {
    customSearches: PropTypes.array,
    projects: PropTypes.array,
};
CustomSearchWidget.defaultProps = {
    customSearches: [],
    projects: [],
};

function mapStateToProps(state) {
    return {
        customSearches: state.data.customSearches,
        projects: state.data.projects,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        removeCustomSearch: (data) => dispatch(CustomSearch.remove(data)),
        getProjects: () => dispatch(Projects.get()),
        getCustomSearches: () =>
            dispatch(
                CustomSearch.get((err, data) => {
                    data ? console.log("data: ", data) : console.log("err", err);
                })
            ),
    };
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(CustomSearchWidget));
