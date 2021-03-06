import * as React from 'react'
import { AgentRoles } from '../../../types/models'
import { ModalWrapper } from '../../common/ModalWrapper'
import { UserInfo } from '../../../modules/Account/types'
import ReactMd from 'react-md-file'
import { Table } from 'react-bootstrap'
import { ProjectFounder } from '../ProjectFounder/ProjectFounder'
import { Header } from '../../../types/models'
import ProfileCard from '../ProfileCard/ProfileCard'
import ControlPanel from '../ControlPanel/ControlPanel'
import {
  ProjectImage,
  OverviewContainer,
  Text,
  ProfileCardsWrapper,
  InlineImageWrapper,
  CaptionImageWrapper,
} from './ProjectOverview.style'
// TODO - when we actually get the schema from the api then replace
import ProjectControlPanelSchema from '../ControlPanel/schema/Project.schema.json'
import CellControlPanelSchema from '../ControlPanel/schema/Cell.schema.json'
import { EntityType } from '../../../modules/Entities/types'
import { toTitleCase } from '../../../common/utils/formatters'

export interface ParentProps {
  match: any
  projectDid: string
  userInfo: UserInfo
  project: any
  isModalOpen: boolean
  modalData: any
  checkUserDid: () => boolean
  createAgent: (agentData: any) => void
  toggleModal: (data?: any, modalStatus?: boolean) => void
  hasCapability: (Role: [AgentRoles]) => boolean
  ledgerDid: () => void
  imageLink: string
  projectStatus: string
  ledger: {
    modalResponse: string
    isLedgering: boolean
  }
}

export type Props = ParentProps

export const ProjectOverview: React.SFC<Props> = props => {
  const renderModalHeader = (): Header => {
    return {
      title: props.modalData.title,
      subtitle: props.modalData.subtitle,
      icon: props.modalData.icon,
      width: '360',
    }
  }

  const onProjectImageNotFound = (evt): void => {
    evt.target.src = require('../../../assets/images/ixo-placeholder-large.jpg')
  }

  const getVideoID = (link): void => {
    return link.replace('https://vimeo.com/', '')
  }

  const entityType = props.project.entityType
    ? (toTitleCase(props.project.entityType) as EntityType)
    : EntityType.Project

  const controlPanelSchema =
    entityType === EntityType.Cell
      ? CellControlPanelSchema
      : ProjectControlPanelSchema

  return (
    <div>
      <ModalWrapper
        isModalOpen={props.isModalOpen}
        handleToggleModal={(): void => props.toggleModal({})}
        header={renderModalHeader()}
      >
        {props.modalData.content}
      </ModalWrapper>
      <OverviewContainer className="container-fluid">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <ProjectImage
                src={props.imageLink}
                onError={onProjectImageNotFound}
              />
              <Text>
                {props.project.longDescription && (
                  <ReactMd markdown={props.project.longDescription} />
                )}
              </Text>
              {props.project.pageContent &&
                props.project.pageContent.map(content => {
                  return (
                    <div className="content-section" key={content.title}>
                      {content.title && <h2>{content.title}</h2>}
                      {content.text && <p>{content.text}</p>}
                      {content.subTitle && <h3>{content.subTitle}</h3>}
                      {content.subText && <p>{content.subText}</p>}
                      {content.media &&
                        content.media.type === 'image' &&
                        content.media.text && (
                          <InlineImageWrapper>
                            <img
                              src={content.media.link}
                              alt={content.media.text}
                            />
                            <p>{content.media.text}</p>
                          </InlineImageWrapper>
                        )}
                      {content.media &&
                        content.media.type === 'image' &&
                        content.media.caption && (
                          <CaptionImageWrapper>
                            <img
                              src={content.media.link}
                              alt={content.media.caption}
                            />
                            <p>{content.media.caption}</p>
                          </CaptionImageWrapper>
                        )}
                      {content.media && content.media.type === 'video' && (
                        <>
                          <div
                            style={{
                              padding: '56.25% 0 0 0',
                              position: 'relative',
                            }}
                          >
                            <iframe
                              src={`https://player.vimeo.com/video/${getVideoID(
                                content.media.link,
                              )}`}
                              style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                              }}
                              frameBorder="0"
                              allow="autoplay; fullscreen"
                              allowFullScreen
                            ></iframe>
                          </div>
                          <script src="https://player.vimeo.com/api/player.js"></script>
                        </>
                      )}

                      {content.table && (
                        <div className="table-wrapper">
                          <Table striped borderless hover variant="dark">
                            <thead>
                              <tr>
                                {content.table.fields.map(field => (
                                  <th key={field}>{field}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {content.table.data.map((rowData, index) => (
                                <tr key={index}>
                                  {rowData.map((rowInfo, index) => (
                                    <td key={index}>{rowInfo}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </div>
                      )}

                      {content.cards && (
                        <ProfileCardsWrapper>
                          {content.cards.map(user => {
                            return <ProfileCard key={user.title} user={user} />
                          })}
                        </ProfileCardsWrapper>
                      )}
                      <hr />
                    </div>
                  )
                })}

              {props.project.founder && props.project.founder.name !== '' && (
                <ProjectFounder
                  founder={props.project.founder}
                  socialMedia={props.project.socialMedia}
                />
              )}
            </div>
            <div className="col-lg-4">
              <ControlPanel
                schema={controlPanelSchema}
                entityDid={props.projectDid}
                userDid={props.userInfo ? props.userInfo.didDoc.did : null}
              />
            </div>
          </div>
        </div>
      </OverviewContainer>
    </div>
  )
}
